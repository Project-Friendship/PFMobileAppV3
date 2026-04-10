import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, Image, StyleSheet, Alert, Linking, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

import communityPartnersJson from '../../assets/communitypartners.json';
import colors from '../../assets/colors/colors';

interface Partner {
  title: string;
  description: string;
  tags: string;
  url: string;
  logo: string;
  googlemaps: string;
  applemaps: string;
}

interface PartnerWithCheckIn extends Partner {
  hasCheckedIn?: boolean;
  isCheckingIn?: boolean;
}

const allDescriptiveTags = ['Entertainment', 'Games', 'Crafts', 'Snack/Drink', 'Sports', 'Winter Sports',];
const allLocationalTags = ['Carleton', 'St. Olaf', 'In Town'];
const communityPartners: Partner[] = communityPartnersJson;

// API Gateway Stage URL from backend documentation.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://iotqv7u2t0.execute-api.us-east-2.amazonaws.com/Stage-1';

// Get bearer token from AWS Cognito session
const getBearerToken = async (): Promise<string> => {
  const session = await fetchAuthSession();

  // Backend docs specify using Cognito IdToken as bearer token.
  if (session.tokens?.idToken) {
    return session.tokens.idToken.toString();
  }

  if (session.tokens?.accessToken) {
    return session.tokens.accessToken.toString();
  }

  throw new Error('No authentication token available. Please sign in.');
};

// Check in at a community partner location
const checkInAtPartner = async (
  userId: string,
  partnerId: string
): Promise<{ success: boolean; message?: string; data?: any }> => {
  try {
    const token = await getBearerToken();

    const response = await fetch(`${API_BASE_URL}/community`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        partnerId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to check in: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error checking in:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to check in',
    };
  }
};

export default function Community() {
  const [partners, setPartners] = useState<PartnerWithCheckIn[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { userId: currentUserId } = await getCurrentUser();
        setUserId(currentUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  // Load partners once (keep screen behavior simple and predictable)
  useEffect(() => {
    setPartners(communityPartners.map(p => ({ ...p, hasCheckedIn: false, isCheckingIn: false })));
  }, []);

  const openMaps = (googlemapsLink: string, applemapsLink: string) => {
    Alert.alert(
      "Choose a mapping app",
      undefined,
      [
        {
          text: "Google Maps",
          onPress: () => {
            Linking.openURL(googlemapsLink).catch(err => {
              console.error('Error opening Google Maps:', err);
              Alert.alert("Navigation Error", "Could not open Google Maps.");
            });
          }
        },
        {
          text: "Apple Maps",
          onPress: () => {
            Linking.openURL(applemapsLink).catch(err => {
              console.error('Error opening Apple Maps:', err);
              Alert.alert("Navigation Error", "Could not open Apple Maps.");
            });
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };
  

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCheckIn = async (partner: PartnerWithCheckIn) => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated. Please log in to check in.');
      return;
    }

    if (partner.isCheckingIn) {
      return; // Prevent multiple simultaneous check-ins
    }

    // Update UI to show loading state
    setPartners(prevPartners => {
      return prevPartners.map(p => 
        p.title === partner.title 
          ? { ...p, isCheckingIn: true }
          : p
      );
    });

    try {
      const result = await checkInAtPartner(userId, partner.title);
      
      if (result.success) {
        // Update the partner's check-in status
        setPartners(prevPartners => {
          return prevPartners.map(p => 
            p.title === partner.title 
              ? { ...p, hasCheckedIn: true, isCheckingIn: false }
              : p
          );
        });
        
        Alert.alert(
          'Checked In!',
          `You've successfully checked in at ${partner.title}!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Check-In Failed',
          result.message || 'Unable to check in. Please try again later.',
          [{ text: 'OK' }]
        );
        
        // Reset loading state
        setPartners(prevPartners => {
          return prevPartners.map(p => 
            p.title === partner.title 
              ? { ...p, isCheckingIn: false }
              : p
          );
        });
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
      
      // Reset loading state
      setPartners(prevPartners => {
        return prevPartners.map(p => 
          p.title === partner.title 
            ? { ...p, isCheckingIn: false }
            : p
        );
      });
    }
  };

  const renderPartner = ({ item, index }: { item: PartnerWithCheckIn; index: number }) => (
    <View style={styles.partnerRow}>
      <Image source={{ uri: item.logo }} style={styles.partnerLogoSquare} />
    
      <View style={styles.textContainer}>
        {item.url ? (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <View style={styles.partnerTitleRow}>
              <Text style={styles.partnerNameLink}>{item.title}</Text>
              <EvilIcons name="external-link" size={18} color="black" style={styles.externalLinkIcon} />
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.partnerNameLink}>{item.title}</Text>
        )}
        <Text style={styles.partnerDescription}>{item.description}</Text>
      </View>
    
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => openMaps(item.googlemaps, item.applemaps)}
          style={styles.navIconContainer}
          testID={`nav-icon-container-${index}`}
        >
          <Entypo name="location" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleCheckIn(item)}
          style={[
            styles.checkInButton,
            item.hasCheckedIn && styles.checkInButtonChecked,
            item.isCheckingIn && styles.checkInButtonLoading
          ]}
          disabled={item.isCheckingIn || item.hasCheckedIn}
          testID={`check-in-button-${index}`}
        >
          {item.isCheckingIn ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : item.hasCheckedIn ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={24} color="#0066cc" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Activities and Community Partners</Text>
        <Text style={styles.subtitleText}>Bring a Project Friendship VIP card to community partners for deals!</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.tagContainer}
        style={styles.tagScrollView}
      >
        {allLocationalTags.map(tag => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={[
              styles.tagButton,
              selectedTags.includes(tag) && styles.tagButtonSelected,
            ]}
          >
            <Text style={[
              styles.locationalTagButtonText,
              selectedTags.includes(tag) && styles.tagButtonTextSelected,
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.tagDivider} />

        {allDescriptiveTags.map(tag => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={[
              styles.tagButton,
              selectedTags.includes(tag) && styles.tagButtonSelected,
            ]}
          >
            <Text style={[
              styles.descriptiveTagButtonText,
              selectedTags.includes(tag) && styles.tagButtonTextSelected,
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      <FlatList
        data={partners.filter(partner => {
          if (selectedTags.length === 0) return true;

          const partnerTags = partner.tags
            ? partner.tags.split(',').map(tag => tag.trim())
            : [];

          const descriptiveTags = selectedTags.filter(tag => allDescriptiveTags.includes(tag));
          const locationalTags = selectedTags.filter(tag => allLocationalTags.includes(tag));

          const hasAnyDescriptive = descriptiveTags.length === 0 || descriptiveTags.some(tag => partnerTags.includes(tag));
          const hasAnyLocational = locationalTags.length === 0 || locationalTags.some(tag => partnerTags.includes(tag));

          return hasAnyDescriptive && hasAnyLocational;
        })}
        renderItem={renderPartner}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    padding: 16,
  },
  titleBar: {
    paddingVertical: 20,
    backgroundColor: colors.light_blue,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#222",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 12,
    color: "#666"
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tagScrollView: {
    minHeight: 56,
    maxHeight: 56,
    paddingVertical: 4,
  },
  tagButton: {
    borderColor: "gray",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 4,
    marginLeft: 4
  },
  tagButtonSelected: {
    backgroundColor: '#0066cc',
  },
  descriptiveTagButtonText: {
    color: '#ec8c1e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationalTagButtonText: {
    color: '#bc1d29',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagButtonTextSelected: {
    color: '#fff',
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  partnerLogoSquare: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  partnerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerNameLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  externalLinkIcon: {
    marginLeft: 2,
    marginBottom: 4,
  },
  partnerDescription: {
    fontSize: 14,
    color: '#555',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconContainer: {
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    color: '#333',
  },
  checkInButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  checkInButtonChecked: {
    opacity: 0.7,
  },
  checkInButtonLoading: {
    opacity: 0.5,
  },
  tagDivider: {
  width: 1,
  backgroundColor: '#ccc',
  height: '60%',
  marginHorizontal: 8,
  },
});
