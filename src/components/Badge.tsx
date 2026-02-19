import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

interface Props {
  label: string;
  variant?: 'default' | 'primary' | 'secondary' | 'gold';
}

export const Badge: React.FC<Props> = ({ label, variant = 'default' }) => {
  return (
    <View style={[styles.badge, variantStyles[variant]]}>
      <Text variant="label" style={{ color: variant === 'default' ? COLORS.text : COLORS.surface }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
});

const variantStyles = {
  default: {
    backgroundColor: COLORS.border,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  gold: {
    backgroundColor: COLORS.gold,
  },
};

export default Badge;
