import { View, StyleSheet } from 'react-native'
import AIChat from './AIChat'

const AI: React.FC = () => {
  return (
    <View style={styles.container}>
      <AIChat />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default AI
