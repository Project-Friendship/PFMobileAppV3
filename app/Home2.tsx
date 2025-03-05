import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { getCurrentUser } from 'aws-amplify/auth';

export default function Home() {
  const router = useRouter();
  const { authStatus } = useAuthenticator();

  const [user, setUser] = useState<{ username: string; userId?: string; attributes?: { email?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user's data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        setUser({
          username,
          userId, // Include userId in the user state
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

  // Redirect to the tabs screen with the userId
  useEffect(() => {
    if (authStatus === 'authenticated' && user?.userId) {
      router.push({ pathname: '/(tabs)/Home', params: { userId: user.userId } });
    }
  }, [authStatus, user]);

  if (authStatus !== 'authenticated') {
    return (
      <View>
        <ActivityIndicator size="large" color="blue" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome to Home!</Text>
    </View>
  );
}