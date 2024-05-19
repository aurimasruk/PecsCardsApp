import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { sendFeedback } from '../components/api';
import { useNavigation } from '@react-navigation/native';
import categoriesData from '../components/categoriesData';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const [currentCategory, setCurrentCategory] = useState(category);

  useEffect(() => {
    setCurrentCategory(category);
  }, [category]);

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleFeedback = async (score) => {
    if (selectedImage) {
      await sendFeedback(selectedImage.id, score); // Send feedback to server

      if (score === 1) { // 1 - Hide current and similar categories
        navigation.navigate('Categories', { hideCategory: currentCategory.id });
      } else if (score === 2) { // 2 - Hide opposite categories
        navigation.navigate('Categories', { hideOpposite: currentCategory.oppositeCategories });
      } else if (score === 3) { // 3 - Show similar categories and the current category
        navigation.navigate('Categories', { showSimilar: currentCategory.similarCategories, currentCategoryId: currentCategory.id });
      } else if (score === 4) { // 4 - Correct choice - show (reset) all categories
        navigation.navigate('Categories', { resetCategories: true });
      }
    }
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {currentCategory.images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => openImage(image)} style={styles.imageContainer}>
          <Image source={image.src} style={styles.image} />
          <Text style={styles.description}>{image.description}</Text>
        </TouchableOpacity>
      ))}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 10,
      alignItems: 'center',
    },
    imageContainer: {
    width: '100%',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#fff',
    borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ddd',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
    width: '100%',
      height: 300,
      resizeMode: 'contain',
      marginTop: 10,
    },
    description: {
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
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
    maxWidth: 600,
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
      color: '#000',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
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
  
export default CategoryScreen;