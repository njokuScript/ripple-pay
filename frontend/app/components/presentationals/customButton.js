import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

const CustomButton = (props) => {
  // determines whether button is red or white based on disabled
  const buttonStyle = {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: 20,
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
    backgroundColor: '#0F1C52',
    borderRadius: 50,
    paddingTop: 10,
    paddingBottom: 10,
    width: 250,
    overflow: 'hidden',
  },
});

// buttonColor, isDisabled, performAction, and handlePress have to be passed down as props.
// Color should be either red or green based on parent's state
export default CustomButton;
