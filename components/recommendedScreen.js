import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { sendFeedback, getScores, resetEnvironment, runAutomatedFeedback } from '../components/api';
import categoriesData from '../components/categoriesData';
import { DeveloperModeContext } from '../components/DeveloperModeContext';

const RecommendedScreen = () => {
  const { isDeveloperMode } = useContext(DeveloperModeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const loadScores = async () => {
    setLoading(true);
    try {
      console.log('Fetching scores...');
      const scores = await getScores();
      // console.log('Fetched scores:', scores);  # Logging for score fetching

      const updatedData = categoriesData
        .flatMap(category => category.images.map(image => ({
          ...image,
          score: scores[image.id] || 0
        })))
        .filter(image => image.score > 0)
        .sort((a, b) => b.score - a.score);

      // console.log('Updated data:', updatedData);
      setImagesData(updatedData);
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setLoading(false);
    }
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
      try {
        console.log(`Sending feedback for imageId: ${selectedImage.id}, score: ${score}`);
        await sendFeedback(selectedImage.id, score);
        console.log('Feedback sent successfully');
        setModalVisible(false);
        loadScores();
      } catch (error) {
        console.error('Error sending feedback:', error);
      }
    }
  };

  const handleTestFeedback = async () => {
    setFeedbackLoading(true);
    try {
      console.log('Running automated feedback script');
      await runAutomatedFeedback();
      console.log('Automated feedback executed successfully');
    } catch (error) {
      console.error('Error during automated feedback:', error);
    } finally {
      // Add a delay before fetching scores
      setTimeout(async () => {
        console.log('Fetching scores after delay');
        await loadScores();
        setFeedbackLoading(false);
      }, 1000); // delay
    }
  };

  const handleResetEnvironment = async () => {
    try {
      console.log('Resetting environment');
      await resetEnvironment();
      console.log('Environment reset successfully');
      loadScores();
    } catch (error) {
      console.error('Error resetting environment:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading || feedbackLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
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
      )}
      {isDeveloperMode && (
        <View style={styles.devButtonsContainer}>
          <Button title="Reset Environment" onPress={handleResetEnvironment} />
          <Button title="Test Feedback" onPress={handleTestFeedback} disabled={feedbackLoading} />
        </View>
      )}
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
              <TouchableOpacity onPress={() => handleFeedback(4)}>
                <Image source={require('../assets/very-happy.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(3)}>
                <Image source={require('../assets/happy.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(2)}>
                <Image source={require('../assets/neutral.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(1)}>
                <Image source={require('../assets/sad.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
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
    paddingHorizontal: 10,
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
  devButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecommendedScreen;