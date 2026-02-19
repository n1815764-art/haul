import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLiveStream } from '../context/LiveStreamContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme, VIBE_BOARDS } from '../constants/theme';
import { HaulProduct } from '../types/stream';

export const CreateHaulScreen: React.FC = () => {
  const { createHaul } = useLiveStream();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [products, setProducts] = useState<HaulProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
  });
  const [images] = useState([
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  ]);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  const addProduct = () => {
    if (!currentProduct.name || !currentProduct.brand || !currentProduct.price) {
      Alert.alert('Missing Info', 'Please fill in product name, brand, and price');
      return;
    }

    const newProduct: HaulProduct = {
      id: `product-${Date.now()}`,
      name: currentProduct.name,
      brand: currentProduct.brand,
      price: parseFloat(currentProduct.price),
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
      description: currentProduct.description,
    };

    setProducts(prev => [...prev, newProduct]);
    setCurrentProduct({ name: '', brand: '', price: '', description: '' });
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please add a title for your haul');
      return;
    }
    if (selectedVibes.length === 0) {
      Alert.alert('Select Vibes', 'Please select at least one vibe');
      return;
    }
    if (products.length === 0) {
      Alert.alert('Add Products', 'Please add at least one product');
      return;
    }

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

    createHaul({
      title: title.trim(),
      description: description.trim(),
      author: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        isVerified: false,
      },
      images,
      products,
      vibes: selectedVibes,
      totalPrice,
    });

    Alert.alert('Success!', 'Your haul has been shared! 🎉');
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedVibes([]);
    setProducts([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1">Share Your Haul</Text>
          <Text variant="body" color="secondary">
            Show off your latest finds
          </Text>
        </View>

        {/* Images Preview */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesContainer}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity style={styles.removeImage}>
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImage}>
            <Text style={styles.addIcon}>+</Text>
            <Text variant="caption">Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Title */}
        <View style={styles.section}>
          <Text variant="label" style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., My Spring Luxury Haul ✨"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text variant="label" style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about your haul..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Vibes */}
        <View style={styles.section}>
          <Text variant="label" style={styles.label}>Vibes</Text>
          <View style={styles.vibesGrid}>
            {VIBE_BOARDS.map(vibe => (
              <TouchableOpacity
                key={vibe.id}
                style={[
                  styles.vibeChip,
                  selectedVibes.includes(vibe.name) && styles.vibeChipActive,
                ]}
                onPress={() => toggleVibe(vibe.name)}
              >
                <Text
                  variant="body"
                  style={
                    selectedVibes.includes(vibe.name)
                      ? styles.vibeChipTextActive
                      : undefined
                  }
                >
                  {vibe.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text variant="label" style={styles.label}>Products ({products.length})</Text>
          
          {/* Product List */}
          {products.map(product => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text variant="bodyBold" numberOfLines={1}>{product.name}</Text>
                <Text variant="caption" color="secondary">{product.brand}</Text>
                <Text variant="bodyBold" style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeProduct}
                onPress={() => removeProduct(product.id)}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Product Form */}
          <View style={styles.addProductForm}>
            <Text variant="bodyBold" style={styles.addProductTitle}>Add Product</Text>
            <TextInput
              style={styles.input}
              value={currentProduct.name}
              onChangeText={name => setCurrentProduct(prev => ({ ...prev, name }))}
              placeholder="Product name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flex1]}
                value={currentProduct.brand}
                onChangeText={brand => setCurrentProduct(prev => ({ ...prev, brand }))}
                placeholder="Brand"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <TextInput
                style={[styles.input, styles.priceInput]}
                value={currentProduct.price}
                onChangeText={price => setCurrentProduct(prev => ({ ...prev, price }))}
                placeholder="Price"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={currentProduct.description}
              onChangeText={description => setCurrentProduct(prev => ({ ...prev, description }))}
              placeholder="Product description (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={2}
            />
            <Button variant="secondary" onPress={addProduct}>
              + Add Product
            </Button>
          </View>
        </View>

        {/* Total */}
        {products.length > 0 && (
          <View style={styles.totalSection}>
            <Text variant="h3">Total: ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</Text>
          </View>
        )}

        {/* Submit */}
        <View style={styles.submitSection}>
          <Button variant="primary" onPress={handleSubmit}>
            Share Haul
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  imagesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.lg,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImage: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  addIcon: {
    fontSize: 32,
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  vibeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  vibeChipTextActive: {
    color: theme.colors.surface,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productPrice: {
    color: theme.colors.primary,
  },
  removeProduct: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  addProductForm: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  addProductTitle: {
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  flex1: {
    flex: 1,
  },
  priceInput: {
    width: 100,
  },
  totalSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  submitSection: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
});
