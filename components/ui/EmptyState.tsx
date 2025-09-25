import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  message: string;
  icon?: string;
  iconColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  iconColor = '#888'
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
});

export default EmptyState;