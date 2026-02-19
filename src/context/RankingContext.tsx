import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Ranking, ProductScore, ProductMatchup, RankingChoice } from '../types/product';
import { mockProducts } from '../data/mockProducts';

interface RankingContextType {
  // Current matchup
  currentMatchup: ProductMatchup | null;
  
  // Ranking history
  rankings: Ranking[];
  productScores: Map<string, ProductScore>;
  
  // Actions
  generateNewMatchup: (filters?: string[]) => void;
  submitRanking: (choice: RankingChoice) => void;
  skipMatchup: () => void;
  
  // Stats
  totalRankings: number;
  productsRanked: string[];
  topProducts: ProductScore[];
}

const RankingContext = createContext<RankingContextType | undefined>(undefined);

export const RankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMatchup, setCurrentMatchup] = useState<ProductMatchup | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [productScores, setProductScores] = useState<Map<string, ProductScore>>(new Map());

  // Generate a new matchup based on user's style preferences
  const generateNewMatchup = useCallback((filters?: string[]) => {
    let availableProducts = [...mockProducts];
    
    // Filter by vibes if provided
    if (filters && filters.length > 0) {
      availableProducts = availableProducts.filter(p =>
        filters.some(f => p.vibes.includes(f))
      );
    }
    
    // Shuffle and pick two different products
    const shuffled = availableProducts.sort(() => Math.random() - 0.5);
    if (shuffled.length >= 2) {
      setCurrentMatchup({
        productA: shuffled[0],
        productB: shuffled[1],
      });
    }
  }, []);

  // ELO-like ranking algorithm
  const updateScores = useCallback((winnerId: string, loserId: string) => {
    setProductScores(prevScores => {
      const newScores = new Map(prevScores);
      
      // Get current scores (default to 1500)
      const winnerScore = newScores.get(winnerId) || {
        productId: winnerId,
        score: 1500,
        wins: 0,
        losses: 0,
        totalRankings: 0,
      };
      
      const loserScore = newScores.get(loserId) || {
        productId: loserId,
        score: 1500,
        wins: 0,
        losses: 0,
        totalRankings: 0,
      };

      // Calculate expected scores
      const expectedWinner = 1 / (1 + Math.pow(10, (loserScore.score - winnerScore.score) / 400));
      const expectedLoser = 1 / (1 + Math.pow(10, (winnerScore.score - loserScore.score) / 400));
      
      // K-factor (how much scores change)
      const K = 32;
      
      // Update scores
      winnerScore.score += K * (1 - expectedWinner);
      loserScore.score += K * (0 - expectedLoser);
      
      // Update stats
      winnerScore.wins += 1;
      winnerScore.totalRankings += 1;
      loserScore.losses += 1;
      loserScore.totalRankings += 1;
      
      newScores.set(winnerId, winnerScore);
      newScores.set(loserId, loserScore);
      
      return newScores;
    });
  }, []);

  const submitRanking = useCallback((choice: RankingChoice) => {
    if (!currentMatchup || choice === 'skip') return;

    const winnerId = choice === 'A' ? currentMatchup.productA.id : currentMatchup.productB.id;
    const loserId = choice === 'A' ? currentMatchup.productB.id : currentMatchup.productA.id;

    // Create ranking record
    const newRanking: Ranking = {
      id: Date.now().toString(),
      userId: 'current-user', // Replace with actual user ID
      winnerId,
      loserId,
      createdAt: new Date().toISOString(),
    };

    setRankings(prev => [...prev, newRanking]);
    updateScores(winnerId, loserId);
    
    // Generate next matchup
    generateNewMatchup();
  }, [currentMatchup, generateNewMatchup, updateScores]);

  const skipMatchup = useCallback(() => {
    generateNewMatchup();
  }, [generateNewMatchup]);

  // Computed values
  const totalRankings = rankings.length;
  const productsRanked = Array.from(new Set([
    ...rankings.map(r => r.winnerId),
    ...rankings.map(r => r.loserId),
  ]));

  const topProducts = Array.from(productScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <RankingContext.Provider
      value={{
        currentMatchup,
        rankings,
        productScores,
        generateNewMatchup,
        submitRanking,
        skipMatchup,
        totalRankings,
        productsRanked,
        topProducts,
      }}
    >
      {children}
    </RankingContext.Provider>
  );
};

export const useRanking = () => {
  const context = useContext(RankingContext);
  if (context === undefined) {
    throw new Error('useRanking must be used within a RankingProvider');
  }
  return context;
};
