import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
View, 
Text, 
StyleSheet, 
TouchableOpacity, 
TextInput, 
ScrollView, 
ActivityIndicator, 
Alert,
Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const DoctorsScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState(null);
    const [doctorsData, setDoctorsData] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [loading, setLoading] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCity, setManualCity] = useState('');
    const [manualState, setManualState] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    const fetchDoctors = async (loc) => {
        try {
            setLoading(true);
            console.log('Fetching doctors for:', loc);

            const response = await axios.get('https://npiregistry.cms.hhs.gov/api/?version=2.1', {
                params: {
                    city: loc?.city,
                    state: loc?.state,
                    limit: 400,
                },
            });

            console.log('API Response:', response.data);

            const allDoctors = response.data.results || [];
            console.log('Fetched doctors:', allDoctors.length);
            setDoctorsData(allDoctors);

            const uniqueSpecialties = [...new Set(allDoctors.flatMap(doctor => 
                doctor.taxonomies?.map(tax => tax.desc) || []
            ))].filter(Boolean);
            setSpecialties(uniqueSpecialties);

            if (allDoctors.length === 0) {
                Alert.alert('No Results', `No doctors found in ${loc.city}, ${loc.state}. Please check the spelling or try a different location.`);
            }
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching doctors data: ', error);
            Alert.alert('Error', 'Unable to fetch doctors data. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Location changed:', location);
        if (location) {
            fetchDoctors(location);
        } else {
            console.log('Loading default data');
            fetchDoctors({ city: 'New York', state: 'NY' });
        }
    }, [location]);

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;

            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            const address = addressResponse[0];

            if (address && address.country === 'United States') {
                setLocation({ city: address.city, state: address.region });
                fetchDoctors({ city: address.city, state: address.region });
            } else {
                Alert.alert(
                    'Location Outside US',
                    'This app only provides information for US doctors. Please enter a US location manually.',
                    [
                        { text: 'OK', onPress: () => setShowManualInput(true) }
                    ]
                );
            }
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Unable to get your location. Please try again.');
        }
    };

    const filteredDoctors = useMemo(() => {
        let newData = doctorsData;
    
        if (search) {
            const searchTerm = search.toLowerCase();
            newData = newData.filter(item => {
                const firstName = item.basic?.first_name?.toLowerCase() || '';
                const lastName = item.basic?.last_name?.toLowerCase() || '';
                const organizationName = item.basic?.organization_name?.toLowerCase() || '';
                const fullName = `${firstName} ${lastName}`.trim();
                
                return fullName.includes(searchTerm) || organizationName.includes(searchTerm);
            });
        }
    
        if (selectedSpecialty) {
            newData = newData.filter(doctor => 
                doctor.taxonomies?.some(tax => tax.desc === selectedSpecialty)
            );
        }
    
        console.log('Filtered results:', newData.length);
        return newData;
    }, [search, selectedSpecialty, doctorsData]);
    
    useEffect(() => {
        console.log('Filtered doctors:', filteredDoctors.length);
    }, [filteredDoctors]);

    const handleSearch = useCallback((text) => {
        setSearch(text);
    }, []);

    const handleSpecialtySelection = useCallback((specialty) => {
        setSelectedSpecialty(prevSpecialty => prevSpecialty === specialty ? '' : specialty);
    }, []);

    const handleManualSearch = () => {
        if (manualCity && manualState) {
            const formattedCity = manualCity.trim();
            const formattedState = manualState.trim().toUpperCase();
            setLocation({ city: formattedCity, state: formattedState });
            fetchDoctors({ city: formattedCity, state: formattedState });
            setShowManualInput(false);
        } else {
            Alert.alert('Invalid Input', 'Please enter both city and state.');
        }
    };

    const renderDoctorItem = ({ item }) => {
        const fullName = `${item.basic?.first_name || ''} ${item.basic?.last_name || item.basic?.organization_name || 'No Name'}`.trim();
        const specialty = item.taxonomies?.[0]?.desc || 'Specialty not available';
        const city = item.addresses?.[0]?.city || 'City not available';
        const state = item.addresses?.[0]?.state || 'State not available';
        const phone = item.addresses?.[0]?.telephone_number || 'Phone not available';

        return (
            <TouchableOpacity 
                key={item.number}
                style={styles.item} 
                onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
            >
                <Text style={styles.name}>{fullName}</Text>
                <Text style={styles.specialty}>{`Specialty: ${specialty}`}</Text>
                <Text style={styles.location}>{`Location: ${city}, ${state}`}</Text>
                <Text style={styles.phone}>{`Phone: ${phone}`}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#88bdb5" />
                <Text>Loading doctors...</Text>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.contentContainer}
            scrollEnabled={true}
            extraHeight={150}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Find Nearby Doctors & Clinics</Text>
                <Text style={styles.headerSubtitle}>Search by name or use a US location</Text>
                <TouchableOpacity 
                    style={styles.aboutButton}
                    onPress={() => navigation.navigate('AboutScreen')}
                    >
                    <MaterialIcons name="info" size={24} color="white" />
                    </TouchableOpacity>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for doctors..."
                    value={search}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.gpsButton} onPress={getLocation}>
                    <MaterialIcons name="my-location" size={24} color="white" />
                    <Text style={styles.gpsButtonText}>Use My Current Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gpsButton} onPress={() => setShowManualInput(true)}>
                    <MaterialIcons name="map" size={24} color="white" />
                    <Text style={styles.gpsButtonText}>Enter Your Location Manually.</Text>
                </TouchableOpacity>
            </View>

            {showManualInput && (
                <View style={styles.manualInputContainer}>
                    <TextInput
                        style={styles.manualInput}
                        placeholder="Enter city (e.g., Chicago)"
                        value={manualCity}
                        onChangeText={setManualCity}
                    />
                    <TextInput
                        style={styles.manualInput}
                        placeholder="Enter state code (e.g., IL for Illinois)"
                        value={manualState}
                        onChangeText={setManualState}
                    />
                    <TouchableOpacity 
                        style={styles.manualSearchButton}
                        onPress={handleManualSearch}
                    >
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <Text style={styles.helpText}>Please use the two-letter state code (e.g., IL for Illinois)</Text>
                </View>
            )}

            {dataLoaded && (
                <>
                    <Text style={styles.typesHeader}>Specialties</Text>
                    <ScrollView horizontal style={styles.typesSection}>
                        <View style={styles.specialtyButtons}>
                            {specialties.map(specialty => (
                                <TouchableOpacity 
                                    key={specialty} 
                                    onPress={() => handleSpecialtySelection(specialty)} 
                                    style={[
                                        styles.specialtyButton, 
                                        selectedSpecialty === specialty && styles.specialtyButtonActive
                                    ]}
                                >
                                    <Text style={selectedSpecialty === specialty ? styles.typesTextActive : styles.typesText}>
                                        {specialty}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <Text style={styles.typesHeader}>Doctors & Clinics</Text>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => renderDoctorItem({ item: doctor }))
                    ) : (
                        <Text style={styles.noResults}>No doctors found. Try a different search.</Text>
                    )}
                </>
            )}
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    contentContainer: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#88bdb5',
        padding: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation:2,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 3,
        marginTop: 20
    },
    headerSubtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 15,
    },
    searchBar: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333',
        marginBottom: 7,
    },
    gpsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#71a59f',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 10,
        marginBottom: 7,
    },
    gpsButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 10,
    },
    manualInputContainer: {
        padding: 15,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    manualInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    manualSearchButton: {
        backgroundColor: '#88bdb5',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    helpText: {
        marginTop: 10,
        color: '#666',
        fontSize: 12,
    },
    typesHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 10
    },
    typesSection: {
        maxHeight: 120,
    },
    specialtyButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    specialtyButton: {
        backgroundColor: '#e0f0ed',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        marginBottom: 10,
        borderColor:'#000',
        borderWidth:0.10
    },
    specialtyButtonActive: {
        backgroundColor: '#88bdb5',
    },
    typesText: {
        color: '#333',
        fontSize: 14,
    },
    typesTextActive: {
        color: 'white',
        fontSize: 14,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    specialty: {
        fontSize: 16,
        color: '#555',
    },
    location: {
        fontSize: 16,
        color: '#555',
    },
    phone: {
        fontSize: 16,
        color: '#555',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    aboutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
      },
      aboutButtonText: {
        color: 'white',
        marginLeft: 5,
      },
});


export default DoctorsScreen;