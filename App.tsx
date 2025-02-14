import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  useAuthenticator,
  useTheme,
  ThemeProvider
} from '@aws-amplify/ui-react-native';

import awsconfig from './src/aws-exports';
import Home from './src/Home';
Amplify.configure(awsconfig);

const customTheme = {
  tokens: {
    colors: {
      neutral: {
            10: 'red' ,
            20: 'blue' ,
            30: 'brown',
            40: 'orange',
            50: 'violet',
            60: 'pink',
            70: 'green',
            80: 'gray',
            90: 'purple',
            100: 'black',
          },
          black: { value: '#fff' },
          white: { value: '#000' },
    },
    radii: {
      small: { value: '8px' }, // sets border-radius
    },
    spacing: {
      medium: { value: '12px' }, // sets padding
    },
    fonts: {
      default: {
        variable: { value: 'Raleway, sans-serif' },
        static: { value: 'Raleway, sans-serif' },
      }
    }
  },
};


const MyAppHeader = () => {
  const theme = useTheme();
  
  if (!theme) return null;

  const {
    tokens: { space, fontSizes, colors },
  } = theme;

  return (
    <View>
      <Text style={{ fontSize: 24, padding: 16, color: 'black', fontFamily: 'Arial' }}>
        Project Friendship
      </Text>
    </View>
  );
};

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

function App() {
  const theme = useTheme();
  
  if (!theme) return null; // Ensure theme exists before using it

  const {
    tokens: { colors },
  } = theme;

  return (
    <ThemeProvider theme={customTheme}>
    <Authenticator.Provider>
      <Authenticator
        // custom background color
        Container={(props) => (
          <Authenticator.Container
            {...props}
            style={{ backgroundColor: 'lightgray' }}
          />
        )}
        // custom header
        Header={MyAppHeader}
        // custom form style
        components={{
          SignIn: (props) => (
            <Authenticator.SignIn {...props} style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10 }} /> // this style is not working
          ),
        }}
      >
        <View style={style.container}>
          <SignOutButton />
          <Home />
        </View>
      </Authenticator>
    </Authenticator.Provider>
    </ThemeProvider>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default App;
