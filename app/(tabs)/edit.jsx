import React, { useContext, useState, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker'; // Import pentru selectorul de timp
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function EditScreen() {
  const { tasks, editTask } = useContext(TaskContext);
  const router = useRouter();
  const { taskId } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Culoarea categoriei
  const CATEGORY_COLORS = {
    Learning: '#6EC177',
    Working: '#3A81F1',
    General: '#F1C40F',
  };

  useEffect(() => {
    const checkTasks = () => {
      const currentTime = new Date();
      tasks.forEach((task) => {
        if (task.alerted) return; // Sar peste task-urile deja alertate

        const taskEndTime = new Date();
        const [hours, minutes] = task.endTime.split(':').map(Number);
        taskEndTime.setHours(hours, minutes, 0, 0);

        const timeDifference = taskEndTime - currentTime; // Diferența în milisecunde

        if (timeDifference > 0 && timeDifference <= 5 * 60 * 1000) {
          // Afișăm alertă cu 5 minute înainte
          alert(`Task "${task.title}" ends in 5 minutes!`);
          task.alerted = true; // Marchează task-ul ca alertat
        }
      });
    };

    const adjustInterval = () => {
      const now = new Date();
      const msUntilNextMinute =
        60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      setTimeout(() => {
        checkTasks();
        setInterval(checkTasks, 60000); // Continuăm cu un interval de 1 minut
      }, msUntilNextMinute);
    };

    adjustInterval(); // Start sincronizat cu minutul următor

    return () => clearInterval(); // Curățăm intervalul la demontare
  }, [tasks]);

  const handleSave = () => {
    if (title.trim() === '' || !startTime || !endTime || !category) {
      Alert.alert('Validation Error', 'Please complete all fields!');
      return;
    }

    editTask(taskId, {
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
    });

    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Task</Text>

        {/* Task Title */}
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#8E8E8E"
          value={title}
          onChangeText={setTitle}
        />

        {/* Select Category */}
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

        {/* Time Pickers */}
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

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Add notes (optional)"
          placeholderTextColor="#8E8E8E"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    paddingTop: 30, // Mutăm totul mai sus
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
