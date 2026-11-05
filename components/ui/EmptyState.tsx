import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { border, spacing, text as textColors } from '../../constants/theme';

interface EmptyStateProps {
  message: string;
  icon?: string;
  iconColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  // Quiet neutral that still meets 3:1 non-text contrast on the #f9f9f9 screens it sits on.
  iconColor = border.strong
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={48}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 20 sits between spacing.lg and spacing.xl; kept as-is to preserve the existing layout.
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: spacing.md,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: textColors.secondary,
    marginTop: spacing.lg,
  },
});

export default EmptyState;