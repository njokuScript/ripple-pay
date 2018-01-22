import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const WalletTabs = (props) => {
  const topTabContainer = {
    borderColor: '#d3d3d3',
    width: width,
    height: 40,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9'
  };
  const topTab = {
    fontSize: 13,
    fontWeight: "600",
    textAlign: 'center',
    color: "black"
  };
  console.log(props.disabled);
  return (
    <View style={styles.topTabsContainer}>
      <TouchableOpacity
        onPress={props.handleLeftPress}
        style={Object.assign({}, topTabContainer, { borderRightWidth: 2, borderBottomWidth: !props.pressed ? 2 : 1 })}
      >
        <Text style={Object.assign({}, topTab, { color: !props.disabled ? "black" : "gray" })}>
          add destination tag
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.handleRightPress}
        style={Object.assign({}, topTabContainer, { borderBottomWidth: props.pressed ? 2 : 1 })}
      >
        <Text style={Object.assign({}, topTab, { color: !props.disabled ? "black" : "gray" })}>
          remove destination tag
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  topTabsContainer: {
    flex: -1,
    flexDirection: 'row'
  },
});

export default WalletTabs;
