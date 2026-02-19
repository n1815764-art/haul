import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '../context/OrderContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { Order, TrackingEvent } from '../types/order';

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

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

interface Props {
  route?: { params?: { orderId?: string } };
  navigation?: any;
}

export const OrderDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { getOrderById, cancelOrder, reorder } = useOrder();
  
  const orderId = route?.params?.orderId;
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text variant="h3" center>Order not found</Text>
      </SafeAreaView>
    );
  }

  const canCancel = ['pending', 'processing'].includes(order.status);
  const canReorder = order.status === 'delivered' || order.status === 'cancelled';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text variant="bodyBold">Order Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text variant="caption" color="secondary">Order #{order.orderNumber}</Text>
          <Text variant="body">Placed on {formatDate(order.createdAt)}</Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[order.status] }]} />
            <View>
              <Text variant="h3">{statusLabels[order.status]}</Text>
              {order.estimatedDelivery && order.status !== 'delivered' && (
                <Text variant="body" color="secondary">
                  Estimated delivery: {formatDate(order.estimatedDelivery)}
                </Text>
              )}
              {order.status === 'delivered' && (
                <Text variant="body" color="secondary">
                  Delivered on {formatDate(order.updatedAt)}
                </Text>
              )}
            </View>
          </View>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <View style={styles.trackingInfo}>
              <Text variant="caption" color="secondary">Tracking Number</Text>
              <Text variant="bodyBold">{order.trackingNumber}</Text>
              <Text variant="caption" color="secondary">{order.carrier}</Text>
            </View>
          )}
        </View>

        {/* Tracking Timeline */}
        {order.trackingEvents.length > 0 && (
          <View style={styles.timelineSection}>
            <Text variant="h3" style={styles.sectionTitle}>Shipping Timeline</Text>
            <View style={styles.timeline}>
              {order.trackingEvents.map((event, index) => (
                <TimelineItem 
                  key={event.id} 
                  event={event} 
                  isLast={index === order.trackingEvents.length - 1}
                />
              ))}
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Items</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text variant="bodyBold" numberOfLines={1}>{item.name}</Text>
                <Text variant="caption" color="secondary">{item.brand}</Text>
                {(item.size || item.color) && (
                  <Text variant="caption" color="secondary">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' • '}
                    {item.color && `Color: ${item.color}`}
                  </Text>
                )}
                <View style={styles.itemFooter}>
                  <Text variant="caption" color="secondary">Qty: {item.quantity}</Text>
                  <Text variant="bodyBold">${item.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressCard}>
            <Text variant="bodyBold">{order.shippingAddress.name}</Text>
            <Text variant="body" color="secondary">{order.shippingAddress.street}</Text>
            <Text variant="body" color="secondary">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Text>
            <Text variant="body" color="secondary">{order.shippingAddress.country}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Subtotal</Text>
              <Text variant="body">${order.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Shipping</Text>
              <Text variant="body">${order.shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="body" color="secondary">Tax</Text>
              <Text variant="body">${order.tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text variant="bodyBold">Total</Text>
              <Text variant="h3" style={styles.total}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {canCancel && (
            <Button variant="ghost" onPress={() => cancelOrder(order.id)}>
              Cancel Order
            </Button>
          )}
          {canReorder && (
            <Button variant="primary" onPress={() => reorder(order.id)}>
              Reorder
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Timeline Item Component
const TimelineItem: React.FC<{ event: TrackingEvent; isLast: boolean }> = ({ event, isLast }) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, event.completed && styles.timelineDotCompleted]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={[styles.timelineContent, !event.completed && styles.timelineContentInactive]}>
        <Text variant="bodyBold">{event.status}</Text>
        <Text variant="body" color="secondary">{event.description}</Text>
        <Text variant="caption" color="secondary">
          {event.location} • {formatDateTime(event.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    fontSize: 24,
  },
  placeholder: {
    width: 24,
  },
  orderInfo: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  trackingInfo: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  timelineSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  timeline: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.border,
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  timelineDotCompleted: {
    backgroundColor: theme.colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
    gap: 2,
  },
  timelineContentInactive: {
    opacity: 0.5,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  itemCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  addressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  total: {
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
});
