import React, { useContext, useState, useEffect } from 'react';
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

export default function HomeScreen() {
  const {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    checkUpcomingTasks,
    checkExpiredTasks,
    markOverdueTasks,
  } = useContext(TaskContext);

  const [activeTab, setActiveTab] = useState('All'); // Tab activ (All, Completed, Overdue)
  const router = useRouter();

  // Notificare cu 5 minute înainte de expirare
  useEffect(() => {
    const synchronizeWithMinute = () => {
      const now = new Date();
      const msUntilNextMinute =
        60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      return msUntilNextMinute;
    };

    const startInterval = () => {
      const delay = synchronizeWithMinute();
      setTimeout(() => {
        checkAndAlertUpcomingTasks(); // Verifică imediat când începe minutul
        setInterval(checkAndAlertUpcomingTasks, 60000); // Continuă la fiecare minut
      }, delay);
    };

    const checkAndAlertUpcomingTasks = () => {
      const upcomingTasks = checkUpcomingTasks();
      if (upcomingTasks.length > 0) {
        upcomingTasks.forEach((task) => {
          alert(`Task "${task.title}" ends in a few minutes!`);
          task.alerted = true; // Marchează task-ul ca alertat
        });
      }
    };

    startInterval();

    return () => clearInterval(checkAndAlertUpcomingTasks); // Curăță intervalul la demontare
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiredTasks = checkExpiredTasks();
      if (expiredTasks.length > 0) {
        const taskTitles = expiredTasks.map((task) => task.title).join(', ');
        alert(
          `The following tasks have expired and will be moved to Overdue: ${taskTitles}`
        );
        markOverdueTasks(); // Marchează toate task-urile ca "Overdue"
      }
    }, 60000); // Rulează la fiecare minut

    return () => clearInterval(interval); // Curăță intervalul la demontare
  }, [tasks]);

  const handleTaskPress = (task) => {
    Alert.alert(
      'Task Options',
      `What do you want to do with "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit',
          onPress: () => router.push(`/edit?taskId=${task.id}`),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(task.id),
        },
      ]
    );
  };

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

  // Filtrează task-urile pe baza tab-ului activ
  const filteredTasks =
    activeTab === 'All'
      ? tasks.filter((task) => !task.completed && !task.overdue)
      : activeTab === 'Completed'
      ? tasks.filter((task) => task.completed)
      : tasks.filter((task) => task.overdue); // Tab "Overdue"

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.task} onPress={() => handleTaskPress(item)}>
      <View style={[styles.taskCategory, { backgroundColor: item.color }]} />
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskTime}>
          {item.startTime} - {item.endTime}
        </Text>
      </View>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
        <View
          style={item.completed ? styles.circleChecked : styles.circleUnchecked}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ToDoList</Text>

      {/* Tab-uri pentru All, Completed și Overdue */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Overdue' && styles.activeTab]}
          onPress={() => setActiveTab('Overdue')}
        >
          <Text style={styles.tabText}>Overdue</Text>
        </TouchableOpacity>
      </View>

      {/* Lista task-urilor filtrate */}
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
    bottom: 40,
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
});
