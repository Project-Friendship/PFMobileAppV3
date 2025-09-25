import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category?: string;
}

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  showCategory?: boolean;
  style?: ViewStyle;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  showCategory = true,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.eventCard, style]}
      onPress={() => onPress(event)}
    >
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDetails}>
        {event.date} • {event.location}
      </Text>
      {showCategory && event.category && (
        <Text style={styles.eventCategory}>{event.category}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default EventCard;