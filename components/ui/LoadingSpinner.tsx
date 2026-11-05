import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { brand, surface } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  // Brand blue and orange fall below 3:1 on the background; purple is 7.4:1.
  color = brand.purple,
  text = 'Loading user data...'
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 20 sits between spacing.lg and spacing.xl; kept as-is to preserve the existing layout.
    padding: 20,
    backgroundColor: surface.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;