import React from "react";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Ice Cream Social at the Park",
    location: "Weitz Park",
    date: "2024-10-24T20:00:00Z",
    organizer: "Holly Shoenbauer",
    description:
      "Bring your mentee for free ice cream and fun games in the park!",
    like_count: 12,
  },
  {
    id: "1",
    title: "Mentor Training",
    location: "Weitz Center for Creativity, Room 225",
    date: "2024-10-24T20:00:00Z",
    organizer: "Holly Shoenbauer",
    description:
      "Join us for mentor training to learn how to be the best mentor you can be!",
    like_count: 12,
  },
  {
    id: "2",
    title: "Carleton Mentor-Mentee Pool Night",
    location: "Sayles Hall, Carleton College",
    date: "2024-10-24T20:00:00Z",
    organizer: "Hilly Gangolf",
    description:
      "I'm inviting all mentors and mentees to join me for a fun night of pool!",
    like_count: 8,
  },
];

interface EventItem {
  id: string;
  title: string;
  organizer: string;
  date: string;
  image: string;
  location: string;
  description: string;
  like_count: number;
}

export default function Events() {
  const router = useRouter();

  const renderEventItem = ({ item }: { item: EventItem }) => (
    <View style={styles.card}>
      {/* Content Area */}
      <View style={styles.cardContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.dateAndLocationText} numberOfLines={2}>
          {item.location} • {item.date}
        </Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Social Interaction Buttons */}
        <View style={styles.actionBar}>
          {/* Left Side: Interaction */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/(tabs)/create-event")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.dateAndLocationText} numberOfLines={2}>
            Organizer: {item.organizer}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Image
          source={require("../../assets/banner-2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <FlatList
        data={MOCK_EVENTS}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(tabs)/create-event")}
      >
        <Text style={styles.createButtonText}>+ Create Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  navBar: {
    justifyContent: "flex-start",
    backgroundColor: "#FFFF",
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
  },
  logo: {
    width: 500,
    height: 80,
  },
  header: {
    fontSize: 40,
    fontWeight: "800",
    color: "#6024be",
  },
  createButton: {
    backgroundColor: "#6024be",
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    justifyContent: "flex-end",
  },
  registerButton: {
    backgroundColor: "#6024be",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: 150,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listPadding: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  cardHeader: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DDD",
    marginRight: 10,
  },
  organizerText: {
    fontWeight: "700",
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  cardContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 30,
  },
  dateAndLocationText: {
    fontSize: 14,
    color: "#4444449a",
    lineHeight: 20,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  rsvpText: {
    color: "#6024be",
    fontWeight: "600",
  },
  likeText: {
    fontSize: 14,
    color: "#6024be",
    fontWeight: "600",
  },
});
