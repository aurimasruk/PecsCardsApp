import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { DeveloperModeContext } from '../components/DeveloperModeContext';

const SettingsScreen = () => {
  const { isDeveloperMode, setDeveloperMode } = useContext(DeveloperModeContext);

  const toggleDeveloperMode = () => {
    setDeveloperMode(!isDeveloperMode);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Kūrėjo režimas</Text>
        <Switch value={isDeveloperMode} onValueChange={toggleDeveloperMode} />
      </View>
      {/* Add other settings here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
