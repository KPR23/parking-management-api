import { StyleSheet, TextInput, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import SearchBox from '@/components/searchBox';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // const map = useMemo(() => {
  //   if (Platform.OS === 'ios') {
  //     return <AppleMaps.View style={{ flex: 1 }} />;
  //   } else if (Platform.OS === 'android') {
  //     return <GoogleMaps.View style={{ flex: 1 }} />;
  //   } else {
  //     return <Text>Maps are only available on Android and iOS</Text>;
  //   }
  // }, []);

  return (
    <View style={[styles.container, { flex: 1, top: insets.top + 8, marginHorizontal: 16 }]}>
      <SearchBox />
      <View style={styles.nearbyParkingContainer}>
        <Text>Nearby parking</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  nearbyParkingContainer: {
  },
});
