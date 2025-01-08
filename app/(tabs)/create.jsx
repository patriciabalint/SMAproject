import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext'; // Importă contextul

export default function CreateTaskScreen() {
  const router = useRouter();

  // Folosește contextul pentru a obține funcția handleAddTask
  const { handleAddTask } = useTaskContext(); // Accesează funcția din context

  // State pentru task nou
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Funcția pentru a salva task-ul și a-l trimite înapoi la HomeScreen
  const handleSaveTask = () => {
    const newTask = {
      id: Math.random().toString(),
      title: taskTitle,
      category,
      time,
      date,
      notes,
    };

    // Adaugă task-ul în context folosind handleAddTask
    handleAddTask(newTask);

    // Navighează înapoi la HomeScreen
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Titlu */}
      <Text style={styles.title}>New Task ToDo</Text>

      {/* Task Title */}
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        placeholderTextColor="#8f8f9d"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      {/* Categories */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => setCategory('Learning')}>
          <Text
            style={[
              styles.category,
              category === 'Learning' && styles.activeCategory,
            ]}
          >
            ⭕ Learning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('Working')}>
          <Text
            style={[
              styles.category,
              category === 'Working' && styles.activeCategory,
            ]}
          >
            ⭕ Working
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategory('General')}>
          <Text
            style={[
              styles.category,
              category === 'General' && styles.activeCategory,
            ]}
          >
            ⭕ General
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date and Time */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#8f8f9d"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="#8f8f9d"
            value={time}
            onChangeText={setTime}
          />
        </View>
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Enter additional notes"
        placeholderTextColor="#8f8f9d"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0d0c22',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1c1b33',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: '#2e2d5e',
    borderWidth: 1,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    color: '#8f8f9d',
    fontSize: 16,
    paddingVertical: 5,
  },
  activeCategory: {
    color: '#635bff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#635bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
