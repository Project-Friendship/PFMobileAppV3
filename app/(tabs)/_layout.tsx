import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native'

import React from 'react';
import colors from '../../assets/colors/colors'


export default function TabLayout() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: 'white' ,
        tabBarInactiveTintColor: 'black' ,
        tabBarStyle: styles.tabBar }}>
      <Tabs.Screen
        name="events"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="calendar" color={color} />,
        }}
        initialParams={{userId}}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="location-outline" color={color} />,
        }}
        initialParams={{userId}}
      />
       <Tabs.Screen
        name="Home"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
        initialParams={{userId}}
      />
       <Tabs.Screen
        name="alert"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="alert-outline" color={color} />,
        }}
        initialParams={{userId}}
      />
       <Tabs.Screen
        name="relationships"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="people" color={color} />,
        }}
        initialParams={{userId}}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.light_blue, 
    height: '10%'
  }
});