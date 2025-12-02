import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from 'react-native';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

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
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigateToEvents = () => {
    router.push('/events');
  };

  const navigateToTimeLog = () => {
    // Navigate to time log page when implemented
    console.log('Navigate to time log');
  };

  const navigateToRelationships = () => {
    // Navigate to notifications page when implemented
    router.push('/relationships');
  };

  if (loading) {
    // Using LoadingSpinner component but preserving the same rendered structure for tests
    return <LoadingSpinner />;
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
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
          <Text style={styles.emailText}>
            {user.attributes?.email ? `${user.attributes.email}` : ''}
          </Text>
        </View>
      </View>

      <Button
        text="Sign Out"
        onPress={handleSignOut}
        variant="danger"
        style={styles.signOutButton}
        textStyle={styles.signOutButtonText}
      />

      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo-with-title-tagline-clr.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.modulesContainer}>
          {/* Time Log Module */}
          <TouchableOpacity 
            style={[styles.module, styles.timeLogModule]} 
            onPress={navigateToTimeLog}
          >
            <View style={styles.moduleHeader}>
              <Ionicons name="time-outline" size={24} color="#2c3e50" />
              <Text style={styles.moduleTitle}>Time Log</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.timeLogItem}>
                <Text style={styles.timeLogDay}>Today</Text>
                <Text style={styles.timeLogHours}>2.5 hrs</Text>
              </View>
              <View style={styles.timeLogItem}>
                <Text style={styles.timeLogDay}>This Week</Text>
                <Text style={styles.timeLogHours}>2.5 hrs</Text>
              </View>
              <View style={styles.timeLogItem}>
                <Text style={styles.timeLogDay}>This Month</Text>
                <Text style={styles.timeLogHours}>9 hrs</Text>
              </View>
            </View>
            <Text style={styles.viewMoreText}>View Details →</Text>
          </TouchableOpacity>

          {/* Upcoming Events Module */}
          <TouchableOpacity 
            style={[styles.module, styles.eventsModule]} 
            onPress={navigateToEvents}
          >
            <View style={styles.moduleHeader}>
              <Ionicons name="calendar-outline" size={24} color="#2c3e50" />
              <Text style={styles.moduleTitle}>Upcoming Events</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.eventItem}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>24</Text>
                  <Text style={styles.eventMonth}>APR</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>YMCA</Text>
                  <Text style={styles.eventLocation}>YMCA • 2:00 PM</Text>
                </View>
              </View>
              <View style={styles.eventItem}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>30</Text>
                  <Text style={styles.eventMonth}>APR</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>Ice Cream Social</Text>
                  <Text style={styles.eventLocation}>Blast • 6:30 PM</Text>
                </View>
              </View>
            </View>
            <Text style={styles.viewMoreText}>View All Events →</Text>
          </TouchableOpacity>

          {/* Notifications Module */}
          <TouchableOpacity 
            style={[styles.module, styles.notificationsModule]} 
            onPress={navigateToRelationships}
          >
            <View style={styles.moduleHeader}>
              <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
              <Text style={styles.moduleTitle}>Group Notifications</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="alert-circle" size={20} color="#e74c3c" />
                </View>
                <View style={styles.notificationDetails}>
                  <Text style={styles.notificationText}>Event location changed for Community Cleanup</Text>
                  <Text style={styles.notificationTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="people" size={20} color="#3498db" />
                </View>
                <View style={styles.notificationDetails}>
                  <Text style={styles.notificationText}>Sarah joined your volunteer group</Text>
                  <Text style={styles.notificationTime}>Yesterday</Text>
                </View>
              </View>
              <View style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                </View>
                <View style={styles.notificationDetails}>
                  <Text style={styles.notificationText}>Your time log was approved</Text>
                  <Text style={styles.notificationTime}>2 days ago</Text>
                </View>
              </View>
            </View>
            <Text style={styles.viewMoreText}>View All Notifications →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  signOutButton: {
    width: '30%',
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  signOutButtonText: {
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  scrollView: {
    flex: 1,
  },
  modulesContainer: {
    flex: 1,
    gap: 20,
  },
  module: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeLogModule: {
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  eventsModule: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  notificationsModule: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  moduleContent: {
    marginBottom: 12,
  },
  viewMoreText: {
    textAlign: 'right',
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  // Time Log Styles
  timeLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeLogDay: {
    fontSize: 16,
    color: '#2c3e50',
  },
  timeLogHours: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f39c12',
  },
  // Event Styles
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventDate: {
    width: 50,
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDay: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: 'white',
    fontSize: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  eventLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  // Notification Styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
});