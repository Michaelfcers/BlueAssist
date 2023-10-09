import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import customButtonStyles from './Styles';

const CustomButton = ({ title, onPress, disabled, style }) => {
  return (
    <TouchableOpacity
      style={[customButtonStyles.button, style, disabled && customButtonStyles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={customButtonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
