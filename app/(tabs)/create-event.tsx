import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
  Alert,
} from "react-native";

export default function Events() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateEvent = () => {
    Alert.alert(
      "Event Created",
      `Title: ${title}\nDescription: ${description}`,
    );

    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Event Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Birthday Party"
        value={title}
        onChangeText={(text) => setTitle(text)}
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
      <Button title="Save Event" onPress={handleCreateEvent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
});
