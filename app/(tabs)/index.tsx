import { Stack, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput } from 'react-native';
import { DepositoCard } from '../../components/DepositoCard';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import type { Deposito } from '../../types/database';
import { supabase } from '../../utils/supabase';

export default function TabOneScreen() {
  const router = useRouter();
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [selectedDominio, setSelectedDominio] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  const fetchDepositos = async () => {
    try {
      const { data, error } = await supabase
        .from('depositos')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) throw error;
      setDepositos(data || []);
    } catch (error) {
      console.error('Error fetching depositos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDepositos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDepositos();
  };

  const getDominioColor = (dominio: string | null) => {
    switch (dominio?.toLowerCase()) {
      case 'yape': return '#6f42c1';
      case 'bcp': return '#0098d8';
      default: return tintColor;
    }
  };

  const renderHeader = () => (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.header}
    >
      <ThemedText style={styles.title}>Depósitos</ThemedText>
      <ThemedText style={styles.subtitle}>
        Total: {depositos.reduce((sum, dep) => sum + Number(dep.monto), 0).toFixed(2)} BOB
      </ThemedText>
    </MotiView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  const filteredDepositos = depositos.filter((deposito) => {
    if (selectedDominio && deposito.dominio !== selectedDominio) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        deposito.nombre.toLowerCase().includes(query) ||
        deposito.mensaje.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const dominios = [...new Set(depositos.map((d) => d.dominio).filter(Boolean))];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Depósitos',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'regular',
        }}
      />

      <FlatList
        data={filteredDepositos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DepositoCard
            deposito={item}
            onPress={() => router.push(`/deposito/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <MotiView
              style={styles.filters}
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 200 }}
            >
              <TextInput
                style={[styles.searchInput, { borderColor }]}
                placeholder="Buscar por nombre o mensaje..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterTags}
              >
                <Pressable
                  style={[
                    styles.filterTag,
                    { backgroundColor: selectedDominio === null ? tintColor : 'transparent' }
                  ]}
                  onPress={() => setSelectedDominio(null)}
                >
                  <ThemedText style={[
                    styles.filterTagText,
                    { color: selectedDominio === null ? 'white' : tintColor }
                  ]}>
                    Todos
                  </ThemedText>
                </Pressable>
                {dominios.map((dominio) => (
                  <Pressable
                    key={dominio}
                    style={[
                      styles.filterTag,
                      { backgroundColor: selectedDominio === dominio ? getDominioColor(dominio) : 'transparent' }
                    ]}
                    onPress={() => setSelectedDominio(dominio === selectedDominio ? null : dominio)}
                  >
                    <ThemedText style={[
                      styles.filterTagText,
                      { color: selectedDominio === dominio ? 'white' : getDominioColor(dominio) }
                    ]}>
                      {dominio}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </MotiView>
          </>
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tintColor}
          />
        }
      />
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    opacity: 0.7,
  },
  list: {
    paddingBottom: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  filters: {
    marginBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingBottom: 8,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTagText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
