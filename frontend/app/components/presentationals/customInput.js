import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const CustomInput = (props) => {
  return (
    <View style={styles.field}>
      <TextInput style={styles.textInput} {...props} />
      <View>
        {props.errorText}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    padding: 0,
    paddingLeft: 15,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20
  },
  textInput: {
    height: 46,
    fontFamily: 'Kohinoor Bangla',
    color: 'white'
  },
})

export default CustomInput;
