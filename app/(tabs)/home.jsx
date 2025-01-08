import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskContext } from '../context/TaskContext'; // Importă contextul

export default function HomeScreen() {
  const router = useRouter();

  // Folosește contextul pentru a obține task-urile și funcțiile
  const { tasks, completedTasks, handleCompleteTask } = useTaskContext(); // Accesează datele și funcțiile din context

  return (
    <View style={styles.container}>
      {/* Titlu */}
      <Text style={styles.date}>Oct 29, 2024</Text>
      <Text style={styles.title}>
        My <Text style={{ fontWeight: 'bold' }}>ToDoList</Text>
      </Text>

      {/* Lista de Task-uri Active */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskTime}>{item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
              <View style={styles.taskCircle} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks added yet!</Text>
        }
      />

      {/* Titlu pentru Task-uri Complete */}
      <Text style={styles.completedTitle}>Completed</Text>

      {/* Lista de Task-uri Complete */}
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View>
              <Text style={[styles.taskTitle, { color: '#9cd9a5' }]}>
                {item.title}
              </Text>
              <Text style={styles.taskTime}>{item.time}</Text>
            </View>
            <View style={styles.completedIcon} />
          </View>
        )}
      />

      {/* Buton pentru a Adăuga Task Nou */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/create')} // Direcționează către pagina de creare task
      >
        <Text style={styles.addButtonText}>Add new task +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0c22',
    padding: 20,
  },
  date: {
    color: '#635bff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    marginVertical: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1b33',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskTime: {
    color: '#8f8f9d',
    fontSize: 14,
  },
  taskCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#635bff',
  },
  completedTitle: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
  },
  completedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9cd9a5',
  },
  emptyText: {
    color: '#8f8f9d',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#635bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
