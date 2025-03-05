import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category?: string;
}

// Original user-specific mock database - created by AI
const mockDatabase: Record<string, Event[]> = {
  'e1db9520-5081-70b8-b349-ea4464540888': [
    { id: '1', title: 'Swimming Competition', date: '2025-03-10', location: 'City Pool', description: 'A competitive swimming event with top athletes.' , category: 'Sports' },
    { id: '2', title: 'Hackathon', date: '2025-03-15', location: 'Tech Hub', description: 'A 24-hour coding competition with teams of developers.', category: 'Technology'  },
    { id: '3', title: 'AI Conference', date: '2025-04-01', location: 'Convention Center', description: 'A conference bringing together AI professionals from around the world.', category: 'Technology' },
  ],
  user456: [
    { id: '1', title: 'Marathon', date: '2025-03-20', location: 'Central Park', description: 'A city marathon attracting thousands of runners.' },
    { id: '2', title: 'Music Festival', date: '2025-03-25', location: 'Downtown Arena', description: 'A music festival featuring popular bands and artists.' },
  ],
};

// New global events database - created by AI
const eventsDatabase: Event[] = [
  { id: '1', title: 'Swimming Competition', date: '2025-03-10', location: 'City Pool', description: 'A competitive swimming event with top athletes.', category: 'Sports' },
  { id: '2', title: 'Hackathon', date: '2025-03-15', location: 'Tech Hub', description: 'A 24-hour coding competition with teams of developers.', category: 'Technology' },
  { id: '3', title: 'AI Conference', date: '2025-04-01', location: 'Convention Center', description: 'A conference bringing together AI professionals from around the world.', category: 'Technology' },
  { id: '4', title: 'Marathon', date: '2025-03-20', location: 'Central Park', description: 'A city marathon attracting thousands of runners.', category: 'Sports' },
  { id: '5', title: 'Music Festival', date: '2025-03-25', location: 'Downtown Arena', description: 'A music festival featuring popular bands and artists.', category: 'Entertainment' },
  { id: '6', title: 'Art Exhibition', date: '2025-04-05', location: 'Modern Art Museum', description: 'A showcase of contemporary art from local and international artists.', category: 'Arts' },
  { id: '7', title: 'Food and Wine Festival', date: '2025-04-10', location: 'Culinary Center', description: 'An event celebrating local cuisine and international wine selections.', category: 'Food & Drink' },
];

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [globalModalVisible, setGlobalModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { userId } = useLocalSearchParams() as { userId?: string };

  useEffect(() => {
    setTimeout(() => {
      // User-specific events
      const userEvents = mockDatabase[userId ?? ''] || [];
      setEvents(userEvents);

      // All upcoming events (sorted by date)
      const upcomingEvents = eventsDatabase
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAllEvents(upcomingEvents);

      setLoading(false);
    }, 1000);
  }, [userId]);

  const handleEventPress = (event: Event, isGlobal: boolean = false) => {
    setSelectedEvent(event);
    if (isGlobal) {
      setGlobalModalVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const closeModal = (isGlobal: boolean = false) => {
    if (isGlobal) {
      setGlobalModalVisible(false);
    } else {
      setModalVisible(false);
    }
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* User Events Section */}
      <View style={styles.userEventsSection}>
        <Text style={styles.header}>My Events - {userId}</Text>
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No events available</Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item)}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDetails}>{item.date} • {item.location}</Text>
                <Text style={styles.eventCategory}>{item.category}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Global Upcoming Events Section */}
      <View style={styles.globalEventsSection}>
        <Text style={styles.header}>Upcoming Events</Text>
        <FlatList
          data={allEvents}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item, true)}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDetails}>{item.date} • {item.location}</Text>
              <Text style={styles.eventCategory}>{item.category}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* User Event Modal */}
      {selectedEvent && !globalModalVisible && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalDetails}>Date: {selectedEvent.date}</Text>
              <Text style={styles.modalDetails}>Location: {selectedEvent.location}</Text>
              <Text style={styles.modalDescription}>{selectedEvent.description}</Text>

              <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Global Events Modal */}
      {selectedEvent && globalModalVisible && (
        <Modal
          visible={globalModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => closeModal(true)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalDetails}>Date: {selectedEvent.date}</Text>
              <Text style={styles.modalDetails}>Location: {selectedEvent.location}</Text>
              <Text style={styles.modalDetails}>Category: {selectedEvent.category}</Text>
              <Text style={styles.modalDescription}>{selectedEvent.description}</Text>

              <TouchableOpacity style={styles.closeButton} onPress={() => closeModal(true)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEventsSection: {
    marginBottom: 8, 
  },
  globalEventsSection: {
    marginTop: 0, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  eventCategory: {
    fontSize: 12,
    color: '#007BFF',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalDetails: {
    fontSize: 16,
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});