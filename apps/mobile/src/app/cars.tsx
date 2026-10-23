import { StyleSheet, Text, View } from 'react-native';

export default function CarsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cars</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
  },
});
