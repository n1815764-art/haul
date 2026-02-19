import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../context/OrderContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { Order } from '../types/order';

const statusColors: Record<Order['status'], string> = {
  pending: '#FF9500',
  processing: '#007AFF',
  shipped: '#5856D6',
  delivered: '#34C759',
  cancelled: '#FF3B30',
  refunded: '#8E8E93',
};

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface Props {
  navigation?: any;
}

export const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const { orders, orderSummary } = useOrder();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return ['pending', 'processing', 'shipped'].includes(order.status);
    }
    if (activeTab === 'completed') {
      return ['delivered', 'cancelled', 'refunded'].includes(order.status);
    }
    return true;
  });

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation?.navigate('OrderDetail', { orderId: item.id })}
    >
      {/* Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text variant="caption" color="secondary">Order #{item.orderNumber}</Text>
          <Text variant="body">{formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
          <Text variant="caption" style={{ color: statusColors[item.status] }}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        {item.items.slice(0, 3).map((orderItem, index) => (
          <Image 
            key={orderItem.id} 
            source={{ uri: orderItem.image }} 
            style={[styles.itemImage, index > 0 && styles.itemImageOverlap]}
          />
        ))}
        {item.items.length > 3 && (
          <View style={[styles.moreItems, styles.itemImageOverlap]}>
            <Text variant="caption" style={styles.moreItemsText}>+{item.items.length - 3}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <Text variant="body" color="secondary">
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
        </Text>
        <Text variant="bodyBold" style={styles.total}>${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Orders</Text>
      </View>

      {/* Summary Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryContainer}
      >
        <View style={styles.summaryCard}>
          <Text variant="h2">{orderSummary.totalOrders}</Text>
          <Text variant="caption" color="secondary">Total Orders</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text variant="h2">${orderSummary.totalSpent.toFixed(0)}</Text>
          <Text variant="caption" color="secondary">Total Spent</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text variant="h2">{orderSummary.pendingOrders}</Text>
          <Text variant="caption" color="secondary">In Progress</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text variant="h2">{orderSummary.deliveredOrders}</Text>
          <Text variant="caption" color="secondary">Delivered</Text>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text variant="bodyBold">All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text variant="bodyBold">Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text variant="bodyBold">Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text variant="h3" center>No orders yet</Text>
            <Text variant="body" color="secondary" center>
              Your orders will appear here
            </Text>
            <Button variant="primary" onPress={() => {}} style={styles.shopButton}>
              Start Shopping
            </Button>
          </View>
        }
      />
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
  },
  summaryContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    minWidth: 100,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  list: {
    padding: theme.spacing.lg,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  itemsPreview: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  itemImageOverlap: {
    marginLeft: -15,
  },
  moreItems: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  moreItemsText: {
    color: theme.colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  total: {
    color: theme.colors.primary,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  shopButton: {
    marginTop: theme.spacing.lg,
  },
});
