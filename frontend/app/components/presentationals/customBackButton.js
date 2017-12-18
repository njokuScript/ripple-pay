import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {
  TouchableOpacity,
  Text,
} from 'react-native';

const CustomBackButton = (props) => {
  return (
    <TouchableOpacity style={props.style || {}} onPress={props.handlePress}>
      <Text><Icon name="chevron-left" size={30} color={"white"}/></Text>
    </TouchableOpacity>
  );
};

export default CustomBackButton;
