import React from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';

import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  useAuthenticator,
  useTheme,
  ThemeProvider
} from '@aws-amplify/ui-react-native';




import awsconfig from './aws-exports';
import Home from './(tabs)/Home';
import { Link } from 'expo-router';
// import Home from './src/(tabs)/Home';
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
            60: '#7030a0', // PF purple
            70: 'green',
            80: 'gray',
            90: '#bc1d29', // PF red
            100: '#bc1d29',
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
        variable: { value: 'Vision' },
        static: { value: 'Vision' },
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
      <Image source={require('../assets/pf-logo-transparent.png')} style={{ alignSelf: 'center'}} />
      {/* <Text style={{ fontSize: 30, padding: 16, color: 'black', fontFamily: 'Vision', textAlign: 'center' }}>
        Project Friendship
      </Text> */}
      <Link href='/(tabs)/Home'>Skip to home</Link>
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
              style={{ backgroundColor: 'cornsilk' }}
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
