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

// This is where your future data from an API will go
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Have a good Spring Break St. Olaf!",
    organizer: "Holly Shoenbauer",
    date: "Oct 24 • 8:00 PM",
    location: "Weitz Park",
    event_date: "2024-10-24T20:00:00Z",
    description:
      "Don't forget to take some time to relax and recharge during Spring Break! Whether you're heading home, traveling, or just taking it easy on campus, make sure to enjoy the break and come back refreshed for the rest of the semester!",
    like_count: 12,
  },
  {
    id: "2",
    title: "Remember to complete Mentee-Mentor Survey!",
    organizer: "Hilly Gangolf",
    date: "Oct 26 • 5:30 PM",
    location: "Sayles Hall, Carleton College",
    event_date: "2024-10-24T20:00:00Z",
    description:
      "Please complete the survey to help us improve the mentorship program! Your feedback is valuable in making the program better for everyone. The survey should only take a few minutes to complete, and your responses will be kept confidential. Thank you for taking the time to share your thoughts with us!",
    like_count: 8,
  },
  {
    id: "3",
    title: "Mentorship Training This Weekend!",
    organizer: "Project Friendship Team",
    date: "Oct 26 • 5:30 PM",
    location: "Sayles Hall, Carleton College",
    event_date: "2024-10-24T20:00:00Z",
    description:
      "Check email for details about the mentorship training happening this weekend! This training is designed to provide mentors and mentees with the tools and resources they need to have a successful mentorship experience. Whether you're new to the program or a seasoned participant, this training will offer valuable insights and tips for building strong mentor-mentee relationships. Don't miss out on this opportunity to enhance your mentorship skills and connect with others in the program!",
    like_count: 21,
  },
];

interface EventItem {
  id: string;
  title: string;
  organizer: string;
  date: string;
  image: string;
  description: string;
  like_count: number;
}

export default function Events() {
  const router = useRouter();

  const renderEventItem = ({ item }: { item: EventItem }) => (
    <View style={styles.card}>
      {/* Header Area */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.organizerText}>{item.organizer}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.cardContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Social Interaction Buttons */}
        <View style={styles.actionBar}>
          {/* Right Side: Primary Action */}
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="heart" size={20} color="#64ddff" />{" "}
            <Text style={styles.likeText}>{item.like_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Image
          source={require("../../assets/banner-2.png")} // Replace with your logo path
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
        onPress={() => router.push("/(tabs)/create-post")}
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
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: 150,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
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
