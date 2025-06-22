import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useEffect, useRef, useState } from 'react';
import NotificationListener from 'react-native-notification-listener';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export interface Notification {
  title: string;
  text: string;
  package: string;
  time: number;
  [key: string]: any;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;

  useEffect(() => {
    NotificationListener.requestPermission();
    const sub = NotificationListener.onNotificationReceivedListener((notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => sub.remove();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification: (n) => setNotifications((prev) => [n, ...prev]) }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NotificationContext.Provider>
  );
}
