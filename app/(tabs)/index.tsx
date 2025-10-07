import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Main from '../../components/main';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Header />
      </View>

      <View style={styles.main}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Main />
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flex: 2,          // 20% (2/(2+6+2))
    backgroundColor: '#fff',
    
  },
  main: {
    flex: 6,          // 60%
    backgroundColor: '#eee',
  },
  scrollContent: {
    flexGrow: 1,      // para que ScrollView ocupe todo el espacio y permita scroll si hace falta
  },
  footer: {
    flex: 2,          // 20%
    backgroundColor: '#fff',
  },
});
