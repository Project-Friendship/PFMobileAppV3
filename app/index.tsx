import React from 'react';
import { View, Image } from 'react-native';
import { Redirect } from 'expo-router';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  useTheme,
  ThemeProvider,
} from '@aws-amplify/ui-react-native';

import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const customTheme = {
  tokens: {
    colors: {
      primary: {
        10: '#f5eafc',
        20: '#e6ccf5',
        40: '#c48fe8',
        60: '#9a55cf',
        80: '#7030a0', // PF purple
        90: '#5c2783',
        100: '#481e66',
      },
      secondary: {
        10: '#e0f5fd',
        20: '#b3e6fa',
        40: '#7fd0f4',
        60: '#33bcee',
        80: '#00aae9', // PF blue
        90: '#0089bb',
        100: '#006a91',
      },
      neutral: {
        10: '#f6f6f6',
        20: '#e9e9e9',
        40: '#c9c9c9',
        60: '#909090',
        80: '#505050',
        90: '#2f2f2f',
        100: '#1b1b1b',
      },
      red: {
        10: '#fdecec',
        20: '#f9c9cd',
        40: '#ef8b94',
        60: '#d94e5a',
        80: '#bc1d29', // PF red
        90: '#9a1721',
        100: '#771219',
      },
      black: '#000000',
      white: '#ffffff',
      background: {
        primary: '#ffffff',
        secondary: '#f6f6f6',
      },
      font: {
        primary: '#1b1b1b',
        secondary: '#505050',
        interactive: '#7030a0',
      },
      border: {
        primary: '#e9e9e9',
        secondary: '#c9c9c9',
      },
    },
  },
};

function MyAppHeader() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
      <Image
        source={require('../assets/pf-logo-transparent.png')}
        accessibilityLabel="Project Friendship"
        resizeMode="contain"
        style={{ width: 240, height: 100 }}
      />
    </View>
  );
}

function LoginScreen() {
  const { tokens } = useTheme();

  return (
    <Authenticator
      Header={MyAppHeader}
      Container={(props) => (
        <Authenticator.Container
          {...props}
          style={{
            backgroundColor: tokens.colors.background.primary,
          }}
        />
      )}
    >
      <Redirect href="/(tabs)/Home" />
    </Authenticator>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Authenticator.Provider>
        <LoginScreen />
      </Authenticator.Provider>
    </ThemeProvider>
  );
}