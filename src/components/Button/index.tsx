import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './styles'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  isLoading?: boolean
  icon: keyof typeof Ionicons.glyphMap
  size?: 'small' | 'medium' | 'large'
  customStyle?: object
}

export default function Button({
  title,
  isLoading = false,
  icon,
  size = 'medium',
  customStyle,
  ...rest
}: ButtonProps) {
  const sizeStyles = {
    small: { padding: 12, fontSize: 14 },
    medium: { padding: 16, fontSize: 16 },
    large: { padding: 20, fontSize: 18 },
  }

  const currentSizeStyle = sizeStyles[size] || sizeStyles.medium

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { padding: currentSizeStyle.padding },
        customStyle,
      ]}
      disabled={isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons
            name={icon}
            style={[styles.icon, { fontSize: currentSizeStyle.fontSize }]}
          />
          <Text style={[styles.text, { fontSize: currentSizeStyle.fontSize }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}
