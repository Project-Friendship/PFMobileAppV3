import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  SafeAreaView, 
  Modal, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category?: string;
}

// Original user-specific mock database 
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

// New global events database
const eventsDatabase: Event[] = [
  { id: '1', title: 'Swimming Competition', date: '2025-03-10', location: 'City Pool', description: 'A competitive swimming event with top athletes.', category: 'Sports' },
  { id: '2', title: 'Hackathon', date: '2025-03-15', location: 'Tech Hub', description: 'A 24-hour coding competition with teams of developers.', category: 'Technology' },
  { id: '3', title: 'AI Conference', date: '2025-04-01', location: 'Convention Center', description: 'A conference bringing together AI professionals from around the world.', category: 'Technology' },
  { id: '4', title: 'Marathon', date: '2025-03-20', location: 'Central Park', description: 'A city marathon attracting thousands of runners.', category: 'Sports' },
  { id: '5', title: 'Music Festival', date: '2025-03-25', location: 'Downtown Arena', description: 'A music festival featuring popular bands and artists.', category: 'Entertainment' },
  { id: '6', title: 'Art Exhibition', date: '2025-04-05', location: 'Modern Art Museum', description: 'A showcase of contemporary art from local and international artists.', category: 'Arts' },
  { id: '7', title: 'Food and Wine Festival', date: '2025-04-10', location: 'Culinary Center', description: 'An event celebrating local cuisine and international wine selections.', category: 'Food & Drink' },
];

// Category options
const categoryOptions = [
  'Sports', 
  'Technology', 
  'Entertainment', 
  'Arts', 
  'Food & Drink',
  'Education'
];

// Leave reason options
const leaveReasonOptions = [
  'I am too busy',
  'Mentee too busy',
  'I changed plans',
  'No longer interested',
  'Schedule conflict',
  'Transportation issues',
  'Other'
];

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [globalModalVisible, setGlobalModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0], // Set default date to today in YYYY-MM-DD format
    location: '',
    description: '',
    category: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllMyEvents, setShowAllMyEvents] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [leaveConfirmModalVisible, setLeaveConfirmModalVisible] = useState(false);
  const [selectedLeaveReason, setSelectedLeaveReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);

  const { userId } = useLocalSearchParams() as { userId?: string };

  useEffect(() => {
    setTimeout(() => {
      // User-specific events
      const userEvents = mockDatabase[userId ?? ''] || []; // GET from database with userID / sessionId
      setEvents(userEvents);

      // All upcoming events (sorted by date)
      const upcomingEvents = eventsDatabase
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAllEvents(upcomingEvents);

      // Recent events (less than 1 month ago)
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1); // Set to one month in the past
      
      const recent = upcomingEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= oneMonthAgo && eventDate <= today; // Events between a month ago and today
      });
      
      setRecentEvents(recent);
      console.log("Recent events loaded:", recent);

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

  // Validate date format YYYY-MM-DD
  const validateDateFormat = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    return true;
  };

  const handleDateChange = (text: string) => {
    setNewEvent({
      ...newEvent,
      date: text,
    });
  };

  const handleCreateEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.description || !selectedCategory) {
      alert('Please fill in all fields');
      return;
    }

    // Validate date format
    if (!validateDateFormat(newEvent.date)) {
      alert('Please enter a valid date in YYYY-MM-DD format');
      return;
    }

    // Generate unique ID (this should be done on the backend)
    const uniqueId = (allEvents.length + 1).toString();
    
    // Create event object with category
    const eventToAdd: Event = {
      ...newEvent,
      id: uniqueId,
      category: selectedCategory
    };

    // Add to global events
    const updatedGlobalEvents = [...allEvents, eventToAdd];
    setAllEvents(updatedGlobalEvents);

    // Add to user events
    setEvents([...events, eventToAdd]);

    // Check if it's a recent event (within the last month)
    const eventDate = new Date(eventToAdd.date);
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    if (eventDate >= oneMonthAgo && eventDate <= today) {
      setRecentEvents([...recentEvents, eventToAdd]);
    }

    // update the database here
    console.log("New event created:", eventToAdd);

    // Clear form, close modal
    setNewEvent({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      category: '',
    });
    setSelectedCategory('');
    setCreateModalVisible(false);
    setCalendarVisible(false); // Make sure to reset calendar visibility too

    // Show confirmation
    alert(`Event "${eventToAdd.title}" created successfully!`);
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
      setEvents([...events, event]); // update database 
      alert(`You have joined: ${event.title}`);
    } else {
      alert('You are already registered for this event');
    }
    
    setGlobalModalVisible(false);
  };

  const openLeaveConfirmation = () => {
    if (selectedEvent) {
      setModalVisible(false); // Hide the event details modal
      setLeaveConfirmModalVisible(true); // Show the leave confirmation modal
      setSelectedLeaveReason(''); // Reset selected reason
      setOtherReason(''); // Reset other reason
    }
  };

  const cancelLeaveEvent = () => {
    setLeaveConfirmModalVisible(false);
    setModalVisible(true); // Show the event details modal again
  };

  const confirmLeaveEvent = () => {
    if (selectedEvent) {
      const reason = selectedLeaveReason === 'Other' ? otherReason : selectedLeaveReason;
      
      if (!reason) {
        alert('Please select a reason for leaving the event');
        return;
      }
      
      // Process the leave event
      const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
      setEvents(updatedEvents);
      
      // update the database here
      console.log(`Left event: ${selectedEvent.title}. Reason: ${reason}`);
      
      // Close all modals
      setLeaveConfirmModalVisible(false);
      setSelectedEvent(null);
      
      // Show confirmation
      alert(`You have left: ${selectedEvent.title}`);
    }
  };

  // Function to view all events for a specific category
  const handleViewAll = (category: string) => {
    switch (category) {
      case 'recent':
        setShowAllRecent(true);
        break;
      case 'myEvents':
        setShowAllMyEvents(true);
        break;
      case 'upcoming':
        setShowAllUpcoming(true);
        break;
      default:
        break;
    }
  };

  const handleDateSelect = (day: any) => {
    console.log("Day selected:", day); // Add logging to verify selection
    
    // Format is YYYY-MM-DD
    const selectedDate = day.dateString;
    
    // Update the new event with the selected date
    setNewEvent({
      ...newEvent,
      date: selectedDate,
    });
    
    // Keep the calendar visible - don't close automatically
    // The user will close it with the hide calendar button
  };

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* User Events Section */}
        <View style={styles.eventsSection}>
          <Text style={styles.header}>My Events - {userId}</Text>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No events available</Text>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                data={showAllMyEvents ? events : events.slice(0, 2)} // Show all or limit to 2
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item)}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDetails}>{item.date} • {item.location}</Text>
                    <Text style={styles.eventCategory}>{item.category}</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled={true}
                style={styles.flatListHeight}
              />
              {events.length > 3 && !showAllMyEvents && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => handleViewAll('myEvents')}
                >
                  <Text style={styles.viewAllButtonText}>View All ({events.length})</Text>
                </TouchableOpacity>
              )}
              {showAllMyEvents && (
                <TouchableOpacity
                  style={styles.viewLessButton}
                  onPress={() => setShowAllMyEvents(false)}
                >
                  <Text style={styles.viewAllButtonText}>View Less</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

         {/* Recent Events Section (< 1 month ago) */}
         <View style={styles.eventsSection}>
          <Text style={styles.header}>Recent Events</Text>
          {recentEvents.length === 0 ? (
            <Text style={styles.noEventsText}>No recent events available</Text>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                data={showAllRecent ? recentEvents : recentEvents.slice(0, 2)}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.eventCard} 
                    onPress={() => handleEventPress(item, true)}
                  >
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDetails}>{item.date} • {item.location}</Text>
                    <Text style={styles.eventCategory}>{item.category}</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled={true}
                style={styles.flatListHeight}
              />
              {recentEvents.length > 3 && !showAllRecent && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => handleViewAll('recent')}
                >
                  <Text style={styles.viewAllButtonText}>View All ({recentEvents.length})</Text>
                </TouchableOpacity>
              )}
              {showAllRecent && (
                <TouchableOpacity
                  style={styles.viewLessButton}
                  onPress={() => setShowAllRecent(false)}
                >
                  <Text style={styles.viewAllButtonText}>View Less</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Global Upcoming Events Section */}
        <View style={styles.eventsSection}>
          <Text style={styles.header}>Upcoming Events</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={showAllUpcoming ? allEvents : allEvents.slice(0, 2)}
              keyExtractor={(item) => item.id}
              horizontal={false}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item, true)}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDetails}>{item.date} • {item.location}</Text>
                  <Text style={styles.eventCategory}>{item.category}</Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled={true}
              style={styles.flatListHeight}
            />
            {allEvents.length > 3 && !showAllUpcoming && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => handleViewAll('upcoming')}
              >
                <Text style={styles.viewAllButtonText}>View All ({allEvents.length})</Text>
              </TouchableOpacity>
            )}
            {showAllUpcoming && (
              <TouchableOpacity
                style={styles.viewLessButton}
                onPress={() => setShowAllUpcoming(false)}
              >
                <Text style={styles.viewAllButtonText}>View Less</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Create Event Button */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.buttonText}>Create New Event</Text>
        </TouchableOpacity>
      </ScrollView>

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

              {/* Leave Event Button (now opens the confirmation modal instead) */}
              <TouchableOpacity 
                style={styles.leaveButton} 
                onPress={openLeaveConfirmation}
              >
                <Text style={styles.buttonText}>Leave Event</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Leave Confirmation Modal */}
      <Modal
        visible={leaveConfirmModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelLeaveEvent}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaveModalContent}>
            <Text style={styles.modalTitle}>Why are you leaving this event?</Text>
            
            <ScrollView style={styles.reasonsContainer}>
              {leaveReasonOptions.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonButton,
                    selectedLeaveReason === reason && styles.selectedReason
                  ]}
                  onPress={() => setSelectedLeaveReason(reason)}
                >
                  <Text style={[
                    styles.reasonButtonText,
                    selectedLeaveReason === reason && styles.selectedReasonText
                  ]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {selectedLeaveReason === 'Other' && (
              <View style={styles.otherReasonContainer}>
                <Text style={styles.inputLabel}>Please specify:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your reason"
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            )}
            
            <View style={styles.leaveModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={cancelLeaveEvent}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmLeaveButton} 
                onPress={confirmLeaveEvent}
              >
                <Text style={styles.buttonText}>Confirm Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                <Text style={styles.buttonText}>
                  {events.some(e => e.id === selectedEvent.id) ? 'Already Joined' : 'Join Event'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => closeModal(true)}>
                <Text style={styles.buttonText}>Close</Text>
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
        onRequestClose={() => {
          setCalendarVisible(false);
          setCreateModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createModalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create New Event</Text>
              
              {/* Event Title */}
              <Text style={styles.inputLabel}>Event Title:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event title"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
              />
              
              {/* Event Date */}
              <Text style={styles.inputLabel}>Event Date:</Text>
              
              {/* Show either the date picker button or the calendar based on calendarVisible state */}
              {!calendarVisible ? (
                <TouchableOpacity 
                  style={styles.datePickerButton} 
                  onPress={toggleCalendar}
                >
                  <Text style={styles.dateText}>{newEvent.date}</Text>
                  <Text style={styles.datePickerIcon}>📅</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{
                      [newEvent.date]: {selected: true, selectedColor: '#007BFF'}
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                      selectedDayBackgroundColor: '#007BFF',
                      todayTextColor: '#28a745',
                      arrowColor: '#007BFF',
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayTextColor: '#ffffff',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      monthTextColor: '#2d4150',
                      indicatorColor: '#007BFF'
                    }}
                  />
                  <TouchableOpacity 
                    style={styles.hideCalendarButton} 
                    onPress={toggleCalendar}
                  >
                    <Text style={styles.buttonText}>Hide Calendar</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Event Location */}
              <Text style={styles.inputLabel}>Location:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event location"
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({...newEvent, location: text})}
              />
              
              {/* Event Category */}
              <Text style={styles.inputLabel}>Category:</Text>
              <View style={styles.categoryContainer}>
                {categoryOptions.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Event Description */}
              <Text style={styles.inputLabel}>Description:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter event description"
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                multiline={true}
                numberOfLines={4}
              />
              
              {/* Action Buttons */}
              <View style={styles.createModalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setCalendarVisible(false);
                    setCreateModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.createEventButton} 
                  onPress={handleCreateEvent}
                >
                  <Text style={styles.buttonText}>Create Event</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginRight: 6,
    marginLeft: 6,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 4,
  },
  eventsSection: {
    marginBottom: 24,
  },
  listContainer: {
    padding: 8,
  },
  flatListHeight: {
    minHeight: 100,
    maxHeight: 350,
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewAllButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  viewLessButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  viewAllButtonText: {
    color: '#007BFF',
    fontWeight: '500',
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
    marginTop: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  eventCategory: {
    fontSize: 12,
    color: '#007BFF',
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
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
  createModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  leaveModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    marginRight: 6,
    marginLeft: 6,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalDetails: {
    fontSize: 16,
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
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
  createButton: {
    backgroundColor: '#28a745',
    padding: 12,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  createModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  createEventButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedCategory: {
    backgroundColor: '#007BFF',
  },
  categoryButtonText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  reasonsContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  reasonButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: {
    backgroundColor: '#007BFF',
  },
  reasonButtonText: {
    color: '#333',
    fontSize: 16,
  },
  selectedReasonText: {
    color: '#fff',
  },
  otherReasonContainer: {
    marginBottom: 16,
  },
  leaveModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confirmLeaveButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    height: 44,
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  calendarContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  hideCalendarButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  datePickerIcon: {
    position: 'absolute',
    right: 10,
    color: '#007BFF',
  },
});