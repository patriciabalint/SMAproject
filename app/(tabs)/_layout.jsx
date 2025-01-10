import { Stack } from 'expo-router';

const TabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false, // Ascunde header-ul default
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false, // Ascunde header-ul default
        }}
      />
    </Stack>
  );
};

export default TabsLayout;
