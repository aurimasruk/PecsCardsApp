import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { DeveloperModeContext } from '../components/DeveloperModeContext';

const SettingsScreen = () => {
  const { isDeveloperMode, setDeveloperMode } = useContext(DeveloperModeContext);

  const toggleDeveloperMode = () => {
    setDeveloperMode(!isDeveloperMode);
  };

  const appName = 'Šnekučiai';  // App name
  const appVersion = '1.0.0';   // Version number

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Kūrėjo režimas</Text>
        <Switch value={isDeveloperMode} onValueChange={toggleDeveloperMode} />
      </View>
      {/* Additional settings for future */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{appName}</Text>
        <Text style={styles.footerText}>Versija {appVersion}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
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
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#888',
  },
});

export default SettingsScreen;