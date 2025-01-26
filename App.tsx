import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import awsconfig from "./src/aws-exports";

Amplify.configure(awsconfig);

const AppContent = () => {
  console.log("AppContent is running");
  const { route, user } = useAuthenticator();

  React.useEffect(() => {
    console.log("Route:", route);
    console.log("User:", user);
  }, [route, user]);

  if (route === "authenticated") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.username || "User"}!
        </Text>
        <View style={styles.content}>
          <Text>Your authenticated content goes here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return null; // Let the Authenticator component handle unauthenticated states
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Authenticator.Provider>
        <Authenticator>
          <AppContent />
        </Authenticator>
      </Authenticator.Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    marginTop: 16,
  },
});

export default App;
