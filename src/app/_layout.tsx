// import { useEffect } from 'react'
// import { ActivityIndicator } from 'react-native'
// import { router, Slot } from 'expo-router'
// import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
// import { tokenCache } from '@/storage/tokenCache'
// import { CLERK_KEY } from '@env'

// function InitialLayout() {
//   const { isSignedIn, isLoaded } = useAuth()

//   useEffect(() => {
//     if (!isLoaded) return

//     if (isSignedIn) {
//       router.replace('(auth)')
//     } else {
//       router.replace('(public)')
//     }
//   }, [isSignedIn, isLoaded])

//   return isLoaded ? (
//     <Slot />
//   ) : (
//     <ActivityIndicator
//       style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//     />
//   )
// }

// export default function Layout() {
//   return (
//     <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
//       <InitialLayout />
//     </ClerkProvider>
//   )
// }

import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Slot, useRouter, useSegments } from 'expo-router'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@/storage/tokenCache'
import { CLERK_KEY } from '@env'

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    const inAuthGroup = segments[0] === '(auth)'

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/Home')
    } else if (!isSignedIn) {
      router.replace('/(public)')
    }
  }, [isSignedIn, isLoaded, segments])

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  )
}
