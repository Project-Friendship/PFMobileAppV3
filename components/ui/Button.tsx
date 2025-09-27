import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

interface ButtonProps {
  onPress: () => void;
  text: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  text,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyles: StyleProp<ViewStyle> = [styles.button];

    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'danger':
        baseStyles.push(styles.dangerButton);
        break;
      case 'success':
        baseStyles.push(styles.successButton);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButton);
        break;
    }

    if (disabled) {
      baseStyles.push(styles.disabledButton);
    }

    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }

    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyles: StyleProp<TextStyle> = [styles.buttonText];

    if (variant === 'ghost') {
      baseStyles.push(styles.ghostText);
    }

    if (textStyle) {
      baseStyles.push(textStyle);
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007BFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  ghostText: {
    color: '#007BFF',
  },
});

export default Button;