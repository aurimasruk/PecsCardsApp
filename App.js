import React from 'react';
import { Button, FlatList, View, Image, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { categoriesData } from './components/categoriesData';
// import styles from './components/styles';
import CategoryScreen from './components/categoryScreen';
import SettingsScreen from './components/settingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import RecommendedScreen from './components/recommendedScreen';
// import { sendFeedback } from './components/api';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CategoriesScreen({ navigation }) {
  return (
    <FlatList
      data={categoriesData}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.categoryContainer} 
          onPress={() => navigation.navigate('Category', { category: item })}
        >
          <Image source={item.image} style={styles.image} />
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      numColumns={1} // Single column layout
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 20
  },
  categoryContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%', // Full width of the container
    height: 300, // Adjusted height
    resizeMode: 'contain',  // Changed from 'cover' to 'contain'
    marginTop: 10,
  },
  text: {
    fontSize: 25,
    // fontWeight: 'bold',
    padding: 10,
    marginBottom: 10,
  }
});

function CategoriesStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={({ navigation }) => ({
          title: "Kategorijos",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings-outline" size={25} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.category.title })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Nustatymai" }}
      />
    </Stack.Navigator>
  );
}

function RecommendedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Rekomenduojami"
        component={RecommendedScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings-outline" size={25} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Nustatymai" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Kategorijos" 
          component={CategoriesStack} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="list" color={color} size={size} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Rekomenduojami" 
          component={RecommendedStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="star" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
