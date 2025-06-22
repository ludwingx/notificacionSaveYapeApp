import { StyleSheet, Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Feather } from '@expo/vector-icons';
import type { Deposito } from '../types/database';

interface DepositoCardProps {
  deposito: Deposito;
  onPress?: () => void;
}

export function DepositoCard({ deposito, onPress }: DepositoCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const secondaryText = useThemeColor({}, 'secondaryText');

  const getOrigenIcon = (origen: string | null) => {
    switch (origen?.toLowerCase()) {
      case 'qr': return 'qr-code';
      case 'número': return 'hash';
      default: return 'help-circle';
    }
  };

  const getDominioColor = (dominio: string | null) => {
    switch (dominio?.toLowerCase()) {
      case 'yape': return '#6f42c1';
      case 'bcp': return '#0098d8';
      default: return secondaryText;
    }
  };

  return (
    <Pressable onPress={onPress}>
      <MotiView
        style={[styles.card, { backgroundColor, borderColor }]}
        animate={{ scale: 1 }}
        from={{ scale: 0.9 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <View style={styles.header}>
          <View style={styles.montoContainer}>
            <ThemedText style={styles.monto}>
              {deposito.moneda} {deposito.monto.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.fecha}>
              {format(new Date(deposito.creado_en), 'PPp', { locale: es })}
            </ThemedText>
          </View>
          <View style={styles.iconContainer}>
            <Feather
              name={getOrigenIcon(deposito.origen)}
              size={24}
              color={getDominioColor(deposito.dominio)}
            />
          </View>
        </View>

        <View style={styles.body}>
          <ThemedText style={styles.nombre}>{deposito.nombre}</ThemedText>
          <ThemedText style={styles.mensaje} numberOfLines={2}>
            {deposito.mensaje}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          {deposito.dominio && (
            <View style={[styles.tag, { backgroundColor: getDominioColor(deposito.dominio) }]}>
              <ThemedText style={styles.tagText}>{deposito.dominio}</ThemedText>
            </View>
          )}
          {deposito.origen && (
            <View style={[styles.tag, { backgroundColor: getDominioColor(deposito.dominio) }]}>
              <ThemedText style={styles.tagText}>{deposito.origen}</ThemedText>
            </View>
          )}
        </View>
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  montoContainer: {
    flex: 1,
  },
  monto: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fecha: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  body: {
    marginBottom: 12,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  mensaje: {
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
