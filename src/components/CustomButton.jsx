import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import customButtonStyles from './Styles';

const CustomButton = ({ title, onPress, disabled, style, children }) => {
  return (
    <TouchableOpacity
      style={[customButtonStyles.button, style, disabled && customButtonStyles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children ? (
        children
      ) : (
        <Text style={customButtonStyles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
