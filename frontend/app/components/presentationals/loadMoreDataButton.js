import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome';

const LoadMoreDataButton = (props) => {
  // determines whether button is red or white based on disabled
  const buttonStyle = {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: 13,
    color: props.buttonColor,
    fontFamily: 'Kohinoor Bangla',
    textAlign: 'center'
  };
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={props.handlePress} disabled={props.isDisabled} style={styles.touchableButton}>
        <Font name={props.performAction} size={30} color={props.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touchableButton: {
    overflow: 'hidden',
  },
});

// buttonColor, isDisabled, performAction, and handlePress have to be passed down as props.
// Color should be either red or green based on parent's state
export default LoadMoreDataButton;
