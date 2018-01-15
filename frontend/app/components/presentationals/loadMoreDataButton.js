import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

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
        <Text style={buttonStyle}>
          {props.performAction}
        </Text>
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
