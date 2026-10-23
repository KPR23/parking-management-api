import { SymbolView } from 'expo-symbols';
import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchBox() {
    return (

        <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
                <SymbolView
                    name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                    size={24}
                    tintColor="#000"
                />
            </View>
            <TextInput
                style={styles.searchBox}
                placeholder="Search for a parking"
                placeholderTextColor="#000"
            />
        </View>
    );
}
const styles = StyleSheet.create({
    searchContainer: {
        position: 'relative',
        left: 0,
        right: 0,
        zIndex: 2,
    },
    searchBox: {
        height: 64,
        paddingHorizontal: 16,
        paddingLeft: 60,
        backgroundColor: 'white',
        borderRadius: 999,
        padding: 10,
        fontSize: 16,
    },
    searchIcon: {
        left: 24,
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
});