import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TaskProvider } from '../context/TaskContext'; // Asigură-te că importul este corect

const AuthLayout = () => {
  return (
    <TaskProvider>
      {' '}
      {/* Învelește întreaga aplicație cu TaskProvider */}
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#bafaff" style="dark" />
    </TaskProvider>
  );
};

export default AuthLayout;
