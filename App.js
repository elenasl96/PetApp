import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './app/screens/Welcome';
import User from './app/firebase/Query';

export default function App() {
  return (
   <Welcome/>
   //<User/>
  );
}

