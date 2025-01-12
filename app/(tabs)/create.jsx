import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Biblioteca pentru selecția timpului
import { TaskContext } from '../context/TaskContext';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const { addTask } = useContext(TaskContext);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const CATEGORY_COLORS = {
    Learning: '#6EC177',
    Working: '#3A81F1',
    General: '#F1C40F',
  };

  const handleSave = () => {
    // Validare câmpuri obligatorii
    if (title.trim() === '' || !startTime || !endTime || !category) {
      Alert.alert('Validation Error', 'Please complete all fields!');
      return;
    }

    // Adăugare task
    addTask({
      id: Date.now().toString(),
      title,
      startTime: startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      endTime: endTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      category,
      color: CATEGORY_COLORS[category],
      notes,
      completed: false,
    });

    // Navigare înapoi la Home
    router.push('/(tabs)/home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>New Task ToDo</Text>

        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#8E8E8E"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {Object.keys(CATEGORY_COLORS).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && { color: '#FFFFFF', fontWeight: 'bold' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Time</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={[styles.input, styles.timeInput]}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.timeText}>
              {startTime
                ? startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Start Time'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.timeInput]}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.timeText}>
              {endTime
                ? endTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'End Time'}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add notes (optional)"
          placeholderTextColor="#8E8E8E"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B41',
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2B2C4E',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#2B2C4E',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
