import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const recommendedData = [
  { id: 'r1', src: require('../assets/a.png'), description: 'Recommended Cat' },
  { id: 'r2', src: require('../assets/b.png'), description: 'Recommended Dog' },
  { id: 'r3', src: require('../assets/a.png'), description: 'Recommended Cat' },
  { id: 'r4', src: require('../assets/b.png'), description: 'Recommended Dog' },
  // Ensure you have these images in your assets directory
];

const RecommendedScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleFeedback = (score) => {
    console.log(`Feedback for ${selectedImage ? selectedImage.description : 'unknown'}: ${score}`);
    // Here you would typically update your backend or state with the feedback score
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendedData}
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
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={selectedImage.src} style={styles.fullscreenImage} />}
            <Text style={styles.imageDescription}>{selectedImage ? selectedImage.description : ''}</Text>
            <View style={styles.smileyContainer}>
              <TouchableOpacity onPress={() => handleFeedback(4)}>
                <Image source={require('../assets/a.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(3)}>
                <Image source={require('../assets/b.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(2)}>
                <Image source={require('../assets/a.png')} style={styles.smileyIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeedback(1)}>
                <Image source={require('../assets/b.png')} style={styles.smileyIcon} />
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