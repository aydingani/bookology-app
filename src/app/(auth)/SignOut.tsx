import { View, StyleSheet } from 'react-native'
import Button from '@/components/Button'
import { useAuth } from '@clerk/clerk-expo'

export default function SignOut() {
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Button icon="exit" title="Sign Out" onPress={() => signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
