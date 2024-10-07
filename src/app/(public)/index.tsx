import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import Button from '@/components/Button'
import { useOAuth } from '@clerk/clerk-expo'

WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const googleOAuth = useOAuth({ strategy: 'oauth_google' })
  async function onGoogleSignIn() {
    try {
      setIsLoading(true)

      const redirectUrl = Linking.createURL('/')
      const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl })

      if (oAuthFlow.authSessionResult?.type === 'success') {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Button
        icon="logo-google"
        title="Sign in with Google"
        size="large"
        onPress={onGoogleSignIn}
        isLoading={isLoading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
})
