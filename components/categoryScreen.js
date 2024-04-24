import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {category.images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => openImage(image)} style={styles.imageContainer}>
          <Image 
            source={image.src} 
            style={styles.image}
            onLoad={() => console.log('Image loaded!')}
          />
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
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={selectedImage.src} style={styles.fullscreenImage} />}
            <Text style={styles.imageDescription}>{selectedImage ? selectedImage.description : ''}</Text>
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
      width: '100%', // Ensures that the image container takes full width
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#fff', // Background color for the container
      borderRadius: 10, // Rounded corners for the container
      borderWidth: 2, // Width of the border
      borderColor: '#ddd', // Color of the border
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: '100%', // Full width of the container
      height: 300, // Specified height
      resizeMode: 'contain',
      marginTop: 10,
    },
    description: {
      marginTop: 5,
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
      width: '80%', // Adjust the modal width here
      maxWidth: 600 // Ensures modal doesn't get too wide on large screens
    },
    fullscreenImage: {
      width: '100%',
      height: 300, // Adjust according to your needs
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
      color: '#000',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  });
  

export default CategoryScreen;
