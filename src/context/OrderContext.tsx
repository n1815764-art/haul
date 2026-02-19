import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, OrderSummary, TrackingEvent } from '../types/order';
import { mockOrders } from '../data/mockOrders';

interface OrderContextType {
  // Orders
  orders: Order[];
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  
  // Tracking
  getTrackingEvents: (orderId: string) => TrackingEvent[];
  trackOrder: (trackingNumber: string) => Order | undefined;
  
  // Summary
  orderSummary: OrderSummary;
  
  // Actions
  cancelOrder: (orderId: string) => void;
  reorder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Get order by ID
  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  // Get tracking events for an order
  const getTrackingEvents = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order?.trackingEvents || [];
  }, [orders]);

  // Track order by tracking number
  const trackOrder = useCallback((trackingNumber: string) => {
    return orders.find(o => o.trackingNumber === trackingNumber);
  }, [orders]);

  // Cancel order
  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId && o.status !== 'delivered'
        ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() }
        : o
    ));
  }, []);

  // Reorder items
  const reorder = useCallback((orderId: string) => {
    // In a real app, this would add items to cart
    console.log('Reordering items from order:', orderId);
  }, []);

  // Computed summary
  const orderSummary: OrderSummary = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => ['pending', 'processing'].includes(o.status)).length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrderById,
        getOrdersByStatus,
        getTrackingEvents,
        trackOrder,
        orderSummary,
        cancelOrder,
        reorder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
