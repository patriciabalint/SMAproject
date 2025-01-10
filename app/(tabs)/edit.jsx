import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function EditScreen() {
  const { tasks, editTask } = useContext(TaskContext);
  const router = useRouter();
  const { taskId } = useSearchParams();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setStartTime(task.startTime);
      setEndTime(task.endTime);
      setCategory(task.category);
      setNotes(task.notes);
    }
  }, [taskId]);

  const handleSave = () => {
    if (title.trim() === '' || !startTime || !endTime || !category) {
      alert('Please complete all fields!');
      return;
    }

    editTask(taskId, {
      title,
      startTime,
      endTime,
      category,
      notes,
    });

    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Task</Text>

        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#8E8E8E"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category"
          placeholderTextColor="#8E8E8E"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Start Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter start time"
          placeholderTextColor="#8E8E8E"
          value={startTime}
          onChangeText={setStartTime}
        />

        <Text style={styles.label}>End Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter end time"
          placeholderTextColor="#8E8E8E"
          value={endTime}
          onChangeText={setEndTime}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Add notes (optional)"
          placeholderTextColor="#8E8E8E"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

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
    paddingTop: 50,
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
