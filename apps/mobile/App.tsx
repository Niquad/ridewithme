import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  MOCK_VEHICLES,
  filterVehicles,
  formatPrice,
  getVehicleById,
  type ListingType,
  type Vehicle,
} from '@ridewithme/shared';

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
];

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
};

const BADGE_COLORS: Record<ListingType, { bg: string; text: string }> = {
  buy: { bg: 'rgba(79, 209, 197, 0.16)', text: '#4fd1c5' },
  rent: { bg: 'rgba(91, 141, 239, 0.16)', text: '#5b8def' },
  lease: { bg: 'rgba(167, 139, 250, 0.16)', text: '#a78bfa' },
  auction: { bg: 'rgba(255, 107, 53, 0.16)', text: '#ff6b35' },
};

function Badge({ listingType }: { listingType: ListingType }) {
  const c = BADGE_COLORS[listingType];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{listingType}</Text>
    </View>
  );
}

function VehicleCard({ vehicle, onPress }: { vehicle: Vehicle; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.cardPrice}>{formatPrice(vehicle.price, vehicle.listingType)}</Text>
        <Text style={styles.cardMeta}>
          {vehicle.mileage.toLocaleString()} mi · {vehicle.location}
        </Text>
        <Badge listingType={vehicle.listingType} />
      </View>
    </TouchableOpacity>
  );
}

function DetailScreen({ vehicle, onBack }: { vehicle: Vehicle; onBack: () => void }) {
  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={{ paddingBottom: 32 }}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to marketplace</Text>
      </TouchableOpacity>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.detailImage} />
      <View style={styles.detailBody}>
        <Badge listingType={vehicle.listingType} />
        <Text style={styles.detailTitle}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.detailPrice}>{formatPrice(vehicle.price, vehicle.listingType)}</Text>

        <View style={styles.specGrid}>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Mileage</Text>
            <Text style={styles.specValue}>{vehicle.mileage.toLocaleString()} mi</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Location</Text>
            <Text style={styles.specValue}>{vehicle.location}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Year</Text>
            <Text style={styles.specValue}>{vehicle.year}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>Type</Text>
            <Text style={styles.specValue}>{vehicle.listingType}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>{ACTION_LABEL[vehicle.listingType]}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const vehicles = useMemo(() => {
    return filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
    });
  }, [query, activeFilter]);

  const selectedVehicle = selectedId ? getVehicleById(MOCK_VEHICLES, selectedId) : undefined;

  if (!fontsLoaded) {
    return <View style={styles.safeArea} />;
  }

  if (selectedVehicle) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <DetailScreen vehicle={selectedVehicle} onBack={() => setSelectedId(null)} />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Ride<Text style={styles.titleAccent}>WithMe</Text>
        </Text>
        <TextInput
          style={styles.search}
          placeholder="Search make, model, year..."
          placeholderTextColor="#9a9ea6"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.tabsRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeFilter === tab.value && styles.tabActive]}
            onPress={() => setActiveFilter(tab.value)}
          >
            <Text style={[styles.tabText, activeFilter === tab.value && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} onPress={() => setSelectedId(item.id)} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No vehicles match your search.</Text>}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#15171c',
  },
  header: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#f5f4f1',
  },
  titleAccent: {
    color: '#ff6b35',
  },
  search: {
    backgroundColor: '#1d2027',
    borderWidth: 1,
    borderColor: '#2f333d',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f5f4f1',
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2f333d',
    backgroundColor: '#1d2027',
  },
  tabActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  tabText: {
    color: '#9a9ea6',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#15171c',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: '#1d2027',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2f333d',
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    color: '#f5f4f1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 6,
  },
  cardPrice: {
    color: '#f5f4f1',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardMeta: {
    color: '#9a9ea6',
    fontSize: 12,
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    color: '#9a9ea6',
    textAlign: 'center',
    marginTop: 40,
  },
  backBtn: {
    padding: 16,
  },
  backText: {
    color: '#9a9ea6',
    fontSize: 14,
  },
  detailImage: {
    width: '100%',
    height: 260,
  },
  detailBody: {
    padding: 16,
    gap: 8,
  },
  detailTitle: {
    color: '#f5f4f1',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginTop: 10,
  },
  detailPrice: {
    color: '#f5f4f1',
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 22,
    marginBottom: 14,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 26,
  },
  spec: {
    width: '47%',
    backgroundColor: '#1d2027',
    borderWidth: 1,
    borderColor: '#2f333d',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  specLabel: {
    color: '#9a9ea6',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  specValue: {
    color: '#f5f4f1',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  actionBtn: {
    backgroundColor: '#ff6b35',
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#15171c',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});
