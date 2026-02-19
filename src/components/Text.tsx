import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../constants/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'label';

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
  center?: boolean;
}

export const Text: React.FC<Props> = ({ 
  variant = 'body', 
  color,
  center,
  style,
  ...props 
}) => {
  const variantStyle = TYPOGRAPHY[variant];
  
  return (
    <RNText
      style={[
        variantStyle,
        color && { color },
        center && { textAlign: 'center' },
        style,
      ]}
      {...props}
    />
  );
};

export default Text;
