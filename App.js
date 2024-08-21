import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import DoctorsScreen from './screens/DoctorsScreen';
import DoctorDetailsScreen from './screens/DoctorDetailsScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DoctorsScreen"
                    component={DoctorsScreen}
                    options={{headerShown:false}}
                />
                <Stack.Screen
                    name="DoctorDetails"
                    component={DoctorDetailsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AboutScreen"
                    component={AboutScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
