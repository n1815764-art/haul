import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../constants/theme';
import { Text } from './Text';

interface Props {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  style?: ViewStyle;
}

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export const Avatar: React.FC<Props> = ({ 
  uri,
  name = '',
  size = 'md',
  showBorder = false,
  style,
}) => {
  const dimension = SIZE_MAP[size];
  const initial = name.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          borderWidth: showBorder ? 2 : 0,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }}
        />
      ) : (
        <View style={[styles.fallback, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}>
          <Text variant="h3" color={COLORS.surface}>
            {initial}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Avatar;
