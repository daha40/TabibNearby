import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Card, Avatar, Divider, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DoctorDetailsScreen = ({ navigation,route }) => {
    const { doctor } = route.params;

    const fullName = `${doctor.basic?.first_name || ''} ${doctor.basic?.middle_name ? doctor.basic?.middle_name + ' ' : ''}${doctor.basic?.last_name || doctor.basic?.organization_name || 'No Name'}`.trim();
    const specialties = doctor.taxonomies?.map(tax => tax.desc).join(', ') || 'Specialty not available';
    const address = `${doctor.addresses?.[0]?.address_1 || ''} ${doctor.addresses?.[0]?.address_2 || ''}`.trim();
    const city = doctor.addresses?.[0]?.city || 'City not available';
    const state = doctor.addresses?.[0]?.state || 'State not available';
    const postalCode = doctor.addresses?.[0]?.postal_code || 'Postal code not available';
    const phone = doctor.addresses?.[0]?.telephone_number || 'Phone not available';
    const fax = doctor.addresses?.[0]?.fax_number || 'Fax not available';
    const npi = doctor.number || 'NPI not available';
    const enumerationDate = doctor.basic?.enumeration_date || 'Date not available';
    const lastUpdate = doctor.basic?.last_updated || 'Not available';
    const credentials = doctor.basic?.credential || 'No credentials';

    const handlePhoneCall = () => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleFax = () => {
        console.log('Fax functionality not implemented');
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#000" />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
                <Avatar.Text size={100} label={fullName.charAt(0)} style={styles.avatar} />
                <Card.Title 
                    title={fullName} 
                    subtitle={credentials}
                    titleStyle={styles.name} 
                    subtitleStyle={styles.credentials}
                />
                <Card.Content>
                    <Chip icon="stethoscope" style={styles.chip}>{specialties}</Chip>
                    
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.infoRow}>
                        <Icon name="map-marker" size={20} color="#666" />
                        <Text style={styles.infoText}>{`${address}, ${city}, ${state} ${postalCode}`}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="phone" size={20} color="#666" />
                        <Text style={styles.infoText}>{phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="fax" size={20} color="#666" />
                        <Text style={styles.infoText}>{fax}</Text>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    <View style={styles.infoRow}>
                        <Icon name="card-account-details" size={20} color="#666" />
                        <Text style={styles.infoText}>{`NPI: ${npi}`}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="calendar" size={20} color="#666" />
                        <Text style={styles.infoText}>{`Enumeration Date: ${enumerationDate}`}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="update" size={20} color="#666" />
                        <Text style={styles.infoText}>{`Last Updated: ${lastUpdate}`}</Text>
                    </View>
                </Card.Content>
                <Card.Actions style={styles.actions}>
                    <Button icon="phone" mode="contained" onPress={handlePhoneCall} style={styles.actionButton}>
                        Call
                    </Button>
                    <Button icon="fax" mode="contained" onPress={handleFax} style={styles.actionButton}>
                        Fax
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
        marginTop:20
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom:-15
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#000',
    },
    card: {
        borderRadius: 12,
        elevation: 4,
        marginBottom: 16,
    },
    avatar: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#3498db',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    credentials: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    chip: {
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor:'#e0f0ed'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },
    divider: {
        marginVertical: 16,
    },
    actions: {
        justifyContent: 'space-around',
        padding: 16,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 8,
        backgroundColor:'#71a59f'
    },
});

export default DoctorDetailsScreen;