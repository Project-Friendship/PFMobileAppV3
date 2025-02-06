import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { getCurrentUser, signOut } from 'aws-amplify/auth'; 
import { styles } from './HomeStyles'; 

const Home: React.FC = () => {
  const [user, setUser] = useState<{ username: string; attributes?: { email?: string } } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        setUser({
          username,
          attributes: {
            email: signInDetails?.loginId,
          },
        });
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
      setUser(null); // Clear the user state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
      <Text style={styles.emailText}>
        {user.attributes?.email ? `Email: ${user.attributes.email}` : ''}
      </Text>
      <View style={styles.content}>
        <Text style={styles.title}>Project Friendship</Text>
        <Text style={styles.subtitle}>
          Hello World!
        </Text>
      </View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;