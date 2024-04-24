import React from 'react';
import { Button, FlatList, View, Image, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { categoriesData } from './components/categoriesData';
import CategoryScreen from './components/categoryScreen';
import SettingsScreen from './components/settingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

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
    padding: 10,
    marginBottom: 10,
  }
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={({ navigation }) => ({
            title: "Categories",
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
          options={{ title: "Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
