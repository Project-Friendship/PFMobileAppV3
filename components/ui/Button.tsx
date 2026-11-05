import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { brand, radius, spacing, status, surface, text as textColors, touchTarget } from '../../constants/theme';

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

    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryText);
        break;
      case 'danger':
        baseStyles.push(styles.dangerText);
        break;
      case 'success':
        baseStyles.push(styles.successText);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostText);
        break;
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
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget.min,
    minWidth: touchTarget.min,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: brand.blue,
  },
  secondaryButton: {
    backgroundColor: brand.orange,
  },
  dangerButton: {
    backgroundColor: status.danger,
  },
  successButton: {
    backgroundColor: status.success,
  },
  ghostButton: {
    backgroundColor: surface.transparent,
    borderWidth: 1,
    borderColor: brand.purple,
  },
  disabledButton: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryText: {
    color: textColors.onBlue,
  },
  secondaryText: {
    color: textColors.onOrange,
  },
  dangerText: {
    color: textColors.onRed,
  },
  successText: {
    color: textColors.onSuccess,
  },
  ghostText: {
    color: textColors.link,
  },
});

export default Button;
