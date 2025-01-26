import React, { FC } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

const HomeScreen: FC = () => {
  const { signOut, user } = useAuthenticator((context) => [context.signOut, context.user]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome, {user?.username || 'User'}!
      </Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
