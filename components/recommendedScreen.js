import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { sendFeedback, getScores, resetEnvironment, runAutomatedFeedback } from '../components/api';
import categoriesData from '../components/categoriesData';

const RecommendedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesData, setImagesData] = useState([]);

  const loadScores = async () => {
    const scores = await getScores();
    console.log("Fetched scores:", scores); // Debug log
    const updatedData = categoriesData
      .flatMap(category => category.images.map(image => ({
        ...image,
        score: scores[image.id] || 0
      })))
      .filter(image => image.score > 0)
      .sort((a, b) => b.score - a.score);
    console.log("Updated data:", updatedData); // Debug log
    setImagesData(updatedData);
  };

  useFocusEffect(
    useCallback(() => {
      loadScores();
    }, [])
  );

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleFeedback = async (score) => {
    if (selectedImage) {
      await sendFeedback(selectedImage.id, score);
      setModalVisible(false);
      loadScores();
    }
  };

  const handleTestFeedback = async () => {
    try {
      console.log(`Running automated feedback script`);
      const response = await runAutomatedFeedback();
      console.log("Automated feedback response:", response); // Debug log
      loadScores();
    } catch (error) {
      console.error("Error during automated feedback:", error);
    }
  };

  const handleResetEnvironment = async () => {
    await resetEnvironment();
    loadScores();
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
      <Button title="Reset Environment" onPress={handleResetEnvironment} />
      <Button title="Test Feedback" onPress={handleTestFeedback} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text> 
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
    paddingHorizontal: 0,
  },
  list: {
    paddingHorizontal: 10,
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
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
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
    width: '80%',
  },
  fullscreenImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
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
