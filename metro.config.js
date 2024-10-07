// import { getDefaultConfig } from 'expo/metro-config'
// const { getDefaultConfig } = require('expo/metro-config')

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig(__dirname)
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       assetExts: assetExts.filter((ext) => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   }
// })()

const { getDefaultConfig } = require('expo/metro-config')

module.exports = (() => {
  const config = getDefaultConfig(__dirname)

  const { assetExts } = config.resolver
  config.resolver.assetExts = [...assetExts, 'png', 'svg', 'jpg', 'jpeg', 'gif']

  return config
})()
