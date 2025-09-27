import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, Image, StyleSheet, Alert, Linking, Platform, TouchableOpacity, ScrollView } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import communityPartnersJson from '../../assets/communitypartners.json';
import colors from '../../assets/colors/colors'

interface Partner {
  title: string;
  description: string;
  tags: string;
  url: string;
  logo: string;
  googlemaps: string;
  applemaps: string;
}

const allDescriptiveTags = ['Entertainment', 'Games', 'Crafts', 'Snack/Drink', 'Sports', 'Winter Sports',];
const allLocationalTags = ['Carleton', 'St. Olaf', 'In Town'];
const communityPartners: Partner[] = communityPartnersJson;

export default function Community() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    setPartners(communityPartners);
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

  const renderPartner = ({ item }: { item: Partner }) => (
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
    
      <TouchableOpacity
        onPress={() => openMaps(item.googlemaps, item.applemaps)}
        style={styles.navIconContainer}
      >
        <Entypo name="location" size={24} color="black" />
      </TouchableOpacity>
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
  navIconContainer: {
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    color: '#333',
  },
  tagDivider: {
  width: 1,
  backgroundColor: '#ccc',
  height: '60%',
  marginHorizontal: 8,
  },
});
