import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
  Alert,
  Image,
} from "react-native";

export default function MentorMeeting() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateMentorMeeting = () => {
    Alert.alert(
      "Mentor Meeting Created",
      `Title: ${title}\nDescription: ${description}`,
    );

    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require("../../assets/banner-2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.header}>Time Entry:</Text>
      <Text style={styles.label}>Activity:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Birthday Party"
        value={title}
        onChangeText={(text) => setTitle(text)} // Updates the 'title' variable as you type
      />

      <Text style={styles.label}>Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Today"
        value={date}
        onChangeText={(text) => setDate(date)}
      />
      <Text style={styles.label}>location:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Weitz Center room 225"
        value={location}
        onChangeText={(text) => setLocation(location)}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter details..."
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true}
      />
      <Button title="Save Mentor Meeting" onPress={handleCreateMentorMeeting} />
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

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",

    marginLeft: 20,
    marginTop: 20,
    color: "#1A1A1A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    fontSize: 16,
    marginRight: 20,
    marginLeft: 20,
  },
  logo: {
    width: 500,
    height: 80,
  },
});
