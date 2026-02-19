import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pill';

interface Props extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({ 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...props 
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textVariant = variant === 'primary' ? 'bodyBold' : 'body';
  const textColor = variant === 'primary' 
    ? COLORS.surface 
    : variant === 'ghost' 
    ? COLORS.primary 
    : COLORS.text;

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant={textVariant} style={{ color: textColor }}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.sm,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BORDER_RADIUS.lg,
  },
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.sm,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
