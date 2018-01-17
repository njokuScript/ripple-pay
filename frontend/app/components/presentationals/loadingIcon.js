import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome';

const LoadingIcon = (props) => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size={props.size} color={props.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
});

export default LoadingIcon;
