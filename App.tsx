import React from 'react';
import {Button} from 'react-native';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import config from './src/aws-exports';
import Home from './src/Home'; // Import the Home component

Amplify.configure(config);

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

function App() {

  return (
    <Authenticator.Provider>
      <Authenticator>
          <SignOutButton />
          <Home /> 
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default App;