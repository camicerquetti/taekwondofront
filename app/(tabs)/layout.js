import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta el header en TODAS las pantallas dentro de (tabs)
      }}
    />
  );
}
