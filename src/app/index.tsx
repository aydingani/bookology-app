// import { View, Text } from 'react-native'

// export default function Home() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome to Bookology App!</Text>
//     </View>
//   )
// }

import { Redirect } from 'expo-router'

export default function Index() {
  return <Redirect href="/(public)" />
}
