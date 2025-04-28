import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, Image, StyleSheet, Button, Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import communityPartnersJson from '../../assets/communitypartners.json';

import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';

interface Partner {
  title: string;
  description: string;
  url: string;
  logo: string;
  address: string;
  id: string;
  created: string;
  updated: string;
  owner: string;
}

const communityPartners: Partner[] = communityPartnersJson;

export default function Community() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setPartners(communityPartners);
  }, []);

  const openMaps = (addressString: string) => {
    try {
      const parsed = JSON.parse(addressString);
      const { formatted, location } = parsed;
      const encodedAddress = encodeURIComponent(formatted || '');
      const { latitude, longitude } = location;
  
      let url = '';
      if (Platform.OS === 'ios') {
        url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodedAddress}`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      }
  
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
        Alert.alert("Navigation Error", "Could not open maps.");
      });
    } catch (error) {
      console.error('Failed to parse address JSON:', error);
      Alert.alert("Navigation Error", "Sorry, we couldn't understand this address.");
    }
  };

  const renderPartner = ({ item }: { item: Partner }) => (
    <View style={styles.partnerRow}>
      <Image source={{ uri: item.logo }} style={styles.partnerLogoSquare} />
  
      <View style={styles.textContainer}>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <View style={styles.partnerTitleRow}>
          <Text style={styles.partnerNameLink}>{item.title}</Text>
          <EvilIcons name="external-link" size={18} color="black" style={styles.externalLinkIcon} />
        </View>
      </TouchableOpacity>
        <Text style={styles.partnerDescription}>{item.description}</Text>
      </View>
  
      <TouchableOpacity
        onPress={() => openMaps(item.address)}
        style={styles.navIconContainer}
      >
        <Entypo name="location" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Northfield Community Partners</Text>
        <Text style={styles.subtitleText}>Bring your Project Friendship VIP card for deals and discounts!</Text>
      </View>
  
      <FlatList
        data={partners}
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
  partnerContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  partnerLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  partnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonWrapper: {
    marginHorizontal: 4,
  },
  buttonWrapperCenter: {
    flex: 1,
    alignItems: 'center',
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
  partnerNameLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  partnerDescription: {
    fontSize: 14,
    color: '#555',
  },
  navIconContainer: {
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    color: '#333',
  },
  partnerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  externalLinkIcon: {
    marginLeft: 2,
  },
  titleBar: {
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#222"
  },
  subtitleText: {
    fontSize: 12,
    color: "#666"
  }
});
