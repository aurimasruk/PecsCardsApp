import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import categoriesData from '../components/categoriesData'; 
import { sendFeedback } from '../components/api';
const API_URL = 'http://10.0.2.2:5000';

// const recommendedData = [
//   { id: 'r1', src: require('../assets/a.png'), description: 'Recommended Cat' },
//   { id: 'r2', src: require('../assets/b.png'), description: 'Recommended Dog' },
//   { id: 'r3', src: require('../assets/a.png'), description: 'Recommended Cat' },
//   { id: 'r4', src: require('../assets/b.png'), description: 'Recommended Dog' },
// ];

console.log(categoriesData);


const RecommendedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesData, setImagesData] = useState([]);

  useEffect(() => {
    const loadScores = async () => {
      const scoresJson = await AsyncStorage.getItem('scores');
      const localScores = scoresJson ? JSON.parse(scoresJson) : {};
      const updatedData = categoriesData
        .flatMap(category => category.images.map(image => ({
          ...image,
          score: localScores[image.id] || image.score // Update score from local storage if available
        })))
        .filter(image => image.score > 0)
        .sort((a, b) => b.score - a.score);
      setImagesData(updatedData);
    };
  
    loadScores();
  }, []);

  const loadData = async () => {
    // Assuming you have some endpoint or method to fetch the latest scores
    const updatedData = categoriesData
    .flatMap(category => category.images
    .filter(image => image.score > 0))
    .sort((a, b) => b.score - a.score);
    setImagesData(updatedData);
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const recommendedData = (categoriesData)
    .flatMap(category => category.images
    .filter(image => image.score > 0))
    .sort((a, b) => b.score - a.score); // Sort by score descending

  const handleFeedback = async (score) => {
  if (selectedImage) {
    try {
      // Update score in local storage
      const scoresJson = await AsyncStorage.getItem('scores');
      let scores = scoresJson ? JSON.parse(scoresJson) : {};
      scores[selectedImage.id] = score; // Assume `selectedImage.id` is a unique identifier for images
      await AsyncStorage.setItem('scores', JSON.stringify(scores));
      console.log('Local score updated');

      // Send feedback to the backend API
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: selectedImage.id, score })
      });
      const data = await response.json();
      console.log('Feedback response:', data);
    } catch (error) {
      console.error('Error handling feedback:', error);
    }
    setModalVisible(false); // Close modal after handling feedback
  }
};

  return (
    <View style={styles.container}>
      <FlatList
        data={imagesData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => openImage(item)}
          >
            <Image source={item.src} style={styles.image} />
            <Text style={styles.text}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Uždaryti</Text> 
            </TouchableOpacity>
            {selectedImage && <Image source={selectedImage.src} style={styles.fullscreenImage} />}
            <Text style={styles.imageDescription}>{selectedImage ? selectedImage.description : ''}</Text>
            <View style={styles.smileyContainer}>
              {[4, 3, 2, 1].map(val => (
                <TouchableOpacity key={val} onPress={() => handleFeedback(val)}>
                  <Image source={require(`../assets/a1.png`)} style={styles.smileyIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, // Remove padding from the container
  },
  list: {
    paddingHorizontal: 10 // Ensure no padding affects the list's items
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%', // Use 100% width of the screen
  },
  image: {
    width: '100%', // Ensure the image fills the card
    height: 300, // Maintain a fixed height for uniformity
    resizeMode: 'contain',
    marginTop: 10,
  },
  text: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Modal width as 80% of screen width
  },
  fullscreenImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    color: '#000',
    fontSize: 16,
  },
  imageDescription: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  smileyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  smileyIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default RecommendedScreen;