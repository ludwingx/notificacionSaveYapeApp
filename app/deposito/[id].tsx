import { useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { supabase } from '../../utils/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import type { Deposito } from '../../types/database';

export default function DepositoDetailScreen() {
  const { id } = useLocalSearchParams();
  const [deposito, setDeposito] = useState<Deposito | null>(null);
  const [loading, setLoading] = useState(true);
  
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const secondaryText = useThemeColor({}, 'secondaryText');

  useEffect(() => {
    fetchDeposito();
  }, [id]);

  const fetchDeposito = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('depositos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDeposito(data);
    } catch (error) {
      console.error('Error fetching deposito:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDominioColor = (dominio: string | null) => {
    switch (dominio?.toLowerCase()) {
      case 'yape': return '#6f42c1';
      case 'bcp': return '#0098d8';
      default: return secondaryText;
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (!deposito) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>No se encontró el depósito</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Detalle del Depósito',
          headerLargeTitle: true,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.content}
        >
          {/* Monto y Fecha */}
          <View style={styles.montoContainer}>
            <ThemedText style={styles.montoLabel}>Monto Recibido</ThemedText>
            <ThemedText style={styles.monto}>
              {deposito.moneda} {deposito.monto.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.fecha}>
              {format(new Date(deposito.creado_en), 'PPpp', { locale: es })}
            </ThemedText>
          </View>

          {/* Detalles */}
          <View style={[styles.section, { borderColor }]}>
            <View style={styles.sectionHeader}>
              <Feather name="user" size={20} color={tintColor} />
              <ThemedText style={styles.sectionTitle}>Información del Remitente</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Nombre</ThemedText>
              <ThemedText style={styles.detailValue}>{deposito.nombre}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Mensaje</ThemedText>
              <ThemedText style={styles.detailValue}>{deposito.mensaje}</ThemedText>
            </View>
          </View>

          <View style={[styles.section, { borderColor }]}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color={tintColor} />
              <ThemedText style={styles.sectionTitle}>Detalles de la Transacción</ThemedText>
            </View>
            {deposito.dominio && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Dominio</ThemedText>
                <View style={[styles.tag, { backgroundColor: getDominioColor(deposito.dominio) }]}>
                  <ThemedText style={styles.tagText}>{deposito.dominio}</ThemedText>
                </View>
              </View>
            )}
            {deposito.origen && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Origen</ThemedText>
                <View style={[styles.tag, { backgroundColor: getDominioColor(deposito.dominio) }]}>
                  <ThemedText style={styles.tagText}>{deposito.origen}</ThemedText>
                </View>
              </View>
            )}
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Canal</ThemedText>
              <ThemedText style={styles.detailValue}>{deposito.canal}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Hash</ThemedText>
              <ThemedText style={[styles.detailValue, styles.hash]} numberOfLines={1}>
                {deposito.hash}
              </ThemedText>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  montoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  montoLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  monto: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fecha: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  hash: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 14,
  },
});
