import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions
} from 'react-native';

const CustomInput = (props) => {
  return (
    <View style={styles.field}>
      <TextInput style={styles.textInput} autoComplete={false} autoCapitalize="none" {...props} />
      <View>
        {props.errorText}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
let aspectRatio = width / height;

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    paddingLeft: 15,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20
  },
  textInput: {
    height: height/13,
    fontFamily: 'AppleSDGothicNeo-Light',
    color: 'white'
  },
});

export default CustomInput;
