import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { useRouter } from 'expo-router';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';

export default function HomeScreen() {
  const { tasks, toggleTaskCompletion, deleteTask } = useContext(TaskContext);
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();

  const filteredTasks = showCompleted
    ? tasks.filter((task) => task.completed)
    : tasks;

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  const renderTask = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.task}
        onPress={() => router.push(`/edit?taskId=${item.id}`)}
      >
        <View style={[styles.taskCategory, { backgroundColor: item.color }]} />
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskTime}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
          <View
            style={
              item.completed ? styles.circleChecked : styles.circleUnchecked
            }
          >
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>My ToDoList</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, !showCompleted && styles.activeTab]}
            onPress={() => setShowCompleted(false)}
          >
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showCompleted && styles.activeTab]}
            onPress={() => setShowCompleted(true)}
          >
            <Text style={styles.tabText}>Completed</Text>
          </TouchableOpacity>
        </View>

        {filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
          />
        ) : (
          <Text style={styles.placeholderText}>
            No tasks yet. Tap the button below to add your first task.
          </Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create')}
        >
          <Text style={styles.addButtonText}>Add new task +</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#2B2C4E',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  taskCategory: {
    width: 10,
    height: '100%',
    borderRadius: 5,
    marginRight: 10,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1B41',
  },
  taskTime: {
    fontSize: 16,
    color: '#8E8E8E',
    marginTop: 5,
  },
  circleUnchecked: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleChecked: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
