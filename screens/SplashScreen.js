import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <LinearGradient colors={['#4da396', '#2c5d54']} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <Image source={require('../assets/pic1.png')} style={styles.backgroundImage} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to TabibNearby</Text>
                <Text style={styles.description}>Find nearby doctors by specialty and location</Text>
            </View>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.replace('DoctorsScreen')}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',  // عرض كامل للشاشة
        height: '100%', // ارتفاع كامل للشاشة
        opacity: 0.5,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '10%',  // نسبة 10% من العرض
        marginTop: '10%',  // نسبة 10% من الارتفاع
    },
    title: {
        fontFamily: 'Roboto_700Bold',
        fontSize: width * 0.10,
        fontWeight: 'bold',
        marginBottom: '2%',  // نسبة 2% من الارتفاع
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    description: {
        fontFamily: 'Roboto_400Regular',
        fontSize: width * 0.05,
        color: '#e4e5e4',
        marginBottom: '4%',  // نسبة 4% من الارتفاع
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.15,
        borderRadius: 30,
        elevation: 5,
        marginBottom: '25%',  // نسبة 5% من الارتفاع
    },
    buttonText: {
        fontFamily: 'Roboto_700Bold',
        color: '#4da396',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SplashScreen;
