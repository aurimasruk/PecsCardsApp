import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { sendFeedback, getSessionScores, resetSessionEnvironment } from '../components/api';
import categoriesData from '../components/categoriesData';
import { DeveloperModeContext } from '../components/DeveloperModeContext';

const SessionRecommendedScreen = () => {
  const { isDeveloperMode } = useContext(DeveloperModeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loadScores = async () => {
    setLoading(true);
    try {
      const scores = await getSessionScores();
      const updatedData = categoriesData
        .flatMap(category => category.images.map(image => ({
          ...image,
          score: scores[image.id] || 0
        })))
        .filter(image => image.score > 0)
        .sort((a, b) => b.score - a.score);

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

  useEffect(() => {
    const resetEnvironmentOnStart = async () => {
      console.log('Resetting session environment on start');
      await resetSessionEnvironment();
    };
    resetEnvironmentOnStart();
  }, []);

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleFeedback = async (score) => {
    if (selectedImage) {
      try {
        await sendFeedback(selectedImage.id, score);
        setModalVisible(false);
        loadScores();
      } catch (error) {
        console.error('Error sending feedback:', error);
      }
    }
  };

  const handleResetEnvironment = async () => {
    try {
      console.log('Resetting session environment');
      await resetSessionEnvironment();
      loadScores();
      navigation.navigate('Categories', { resetCategories: true }); // Reset categories
    } catch (error) {
      console.error('Error resetting environment:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
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
          <Button title="Reset session Environment" onPress={handleResetEnvironment} />
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
              <Text style={styles.closeText}>Uždaryti</Text>
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

export default SessionRecommendedScreen;
