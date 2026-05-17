import React from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  Alert,
} from "react-native";

export default function mentee_relationship() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Image
          source={require("../../assets/banner-2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Relationship Overview</Text>
        {/* Box 1: Status */}
        <View style={styles.card}>
          <Text style={styles.label}>Relationship Status</Text>
          <Text style={styles.value}>View your current status here</Text>
        </View>
        {/* Box 2: Mentorship Details */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Mentor</Text>
              <Text style={styles.value}>Not Assigned</Text>
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Mentee</Text>
              <Text style={styles.value}>Pending...</Text>
            </View>
          </View>
        </View>
        {/* Box 3: Guardian Info */}
        <View style={styles.card}>
          <Text style={styles.label}>Mentee Guardians</Text>
          <Text style={styles.value}>Primary Contact: Jane Doe</Text>
        </View>

        <Button
          title="Create Event"
          onPress={() => router.push("/(tabs)/create-event")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    padding: 20,
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
});
