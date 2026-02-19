import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface Props extends ViewProps {
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<Props> = ({ 
  padding = 'md',
  children,
  style,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.card,
        styles[padding],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  sm: {
    padding: 12,
  },
  md: {
    padding: 16,
  },
  lg: {
    padding: 24,
  },
});

export default Card;
