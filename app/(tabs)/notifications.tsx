import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { MotiView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  title: string;
  timestamp: Date;
  data: {
    title: string;
    body: string;
    raw: string;
    packageName?: string;
  };
}

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const getAppColor = (packageName?: string) => {
    if (!packageName) return tintColor;
    if (packageName.includes('yape')) return '#6f42c1';
    if (packageName.includes('bcp')) return '#0098d8';
    return tintColor;
  };

  return (
    <MotiView
      style={[styles.card, { backgroundColor, borderColor }]}
      animate={{ scale: 1, opacity: 1 }}
      from={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.appIndicator,
              { backgroundColor: getAppColor(notification.data.packageName) }
            ]}
          />
          <ThemedText style={styles.title}>{notification.title}</ThemedText>
        </View>
        <ThemedText style={styles.time}>
          {format(new Date(notification.timestamp), 'PPp', { locale: es })}
        </ThemedText>
      </View>

      <View style={styles.body}>
        <ThemedText style={styles.messageText}>{notification.data.body}</ThemedText>
        {notification.data.packageName && (
          <View style={[styles.tag, { backgroundColor: getAppColor(notification.data.packageName) }]}>
            <ThemedText style={styles.tagText}>{notification.data.packageName}</ThemedText>
          </View>
        )}
      </View>

      <View style={[styles.rawDataContainer, { borderColor }]}>
        <ThemedText style={styles.rawDataTitle}>Datos Raw</ThemedText>
        <ThemedText style={styles.rawData}>
          {notification.data.raw}
        </ThemedText>
      </View>
    </MotiView>
  );
};

export default function NotificationsScreen() {  // This is sample data - replace with your actual notifications
  const sampleNotifications = [
    {
      title: 'Notificación de Yape',
      timestamp: new Date(),
      data: {
        title: 'Yape',
        body: 'Has recibido S/ 100.00 de Juan Pérez',
        packageName: 'com.bcp.innovacxion.yapeapp',
        raw: `
android.title=Yape
android.text=Has recibido S/ 100.00 de Juan Pérez
android.subText=null
android.settingsText=null
android.infoText=null
android.template=android.app.Notification$BigTextStyle
android.showChronometer=false
android.showWhen=true
android.useDefaultSound=true
android.deleteIntent.pkg=com.bcp.innovacxion.yapeapp`
      }
    },
    {
      title: 'Notificación de BCP',
      timestamp: new Date(Date.now() - 3600000),
      data: {
        title: 'BCP',
        body: 'Transferencia recibida: S/ 50.00',
        raw: 'Datos completos de la notificación'
      }
    }
  ];

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.contentContainer}>
        <ThemedText style={styles.description}>
          Esta pantalla muestra las notificaciones entrantes en su formato raw para análisis y desarrollo.
        </ThemedText>
        {sampleNotifications.map((notification, index) => (
          <NotificationCard key={index} notification={notification} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 100, // Space for the header
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    opacity: 0.7,
  },
  body: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 8,
  },
  rawData: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 12,
  },
});
