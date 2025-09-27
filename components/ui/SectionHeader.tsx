import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SectionHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  rightElement,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={[styles.headerText, textStyle]}>{title}</Text>
      {rightElement}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SectionHeader;