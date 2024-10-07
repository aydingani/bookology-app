import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home'
import Bookmarks from './Bookmarks'
import AI from './AI'
import SignOut from './SignOut'
import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline'
          } else if (route.name === 'AI') {
            iconName = focused ? 'bulb' : 'bulb-outline'
          } else if (route.name === 'Sign Out') {
            iconName = focused ? 'log-out' : 'log-out-outline'
          }

          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          )
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Bookmarks" component={Bookmarks} />
      <Tab.Screen name="AI" component={AI} />
      <Tab.Screen name="Sign Out" component={SignOut} />
    </Tab.Navigator>
  )
}
