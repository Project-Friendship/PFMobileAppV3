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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: '',
    title: '',
    date: '',
    location: '',
    description: '',
    category: '',
  });

  // THINGS TO DO:
  // 1. Make the create event modal - started at the bottom
  // 2. Make the create event button - set create event modal to true on click
  // 3. Finish the handleCreateEvent method


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

  const handleLeaveEvent = (event: Event) => {
    const updatedEvents = events.filter(e => e.id !== event.id);
    setEvents(updatedEvents);
    alert(`You have left: ${event.title}`);
    setModalVisible(false);
  };

  const handleCreateEvent = () => {
    //FILL LATER

    //Add to global events

    //Clear form, close modal
  };

  const closeModal = (isGlobal: boolean = false) => {
    if (isGlobal) {
      setGlobalModalVisible(false);
    } else {
      setModalVisible(false);
    }
    setSelectedEvent(null);
  };

  const handleJoinEvent = (event: Event) => {
    const isAlreadyJoined = events.some(e => e.id === event.id);
    
    if (!isAlreadyJoined) {
      setEvents([...events, event]);
      alert(`You have joined: ${event.title}`);
    } else {
      alert('You are already registered for this event');
    }
    
    setGlobalModalVisible(false);
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

      {/* Put button here */}


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

              {/* Leave Event Button */}
              <TouchableOpacity 
                style={styles.leaveButton} 
                onPress={() => handleLeaveEvent(selectedEvent)}
              >
                <Text style={styles.closeButtonText}>Leave Event</Text>
              </TouchableOpacity>

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

              <TouchableOpacity 
                style={[
                  styles.joinButton, 
                  events.some(e => e.id === selectedEvent.id) ? styles.joinedButton : null
                ]} 
                onPress={() => handleJoinEvent(selectedEvent)}
              >
                <Text style={styles.closeButtonText}>
                  {events.some(e => e.id === selectedEvent.id) ? 'Already Joined' : 'Join Event'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => closeModal(true)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Create Event Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >

      <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Event</Text>
          </View>
          {/* PUT FIELDS HERE - USE TextInput */}
      </View>
      </Modal>

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
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop:10,
    margin:'auto',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#808080', 
  },
  leaveButton: {
    backgroundColor: '#dc3545', 
    padding: 10,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});