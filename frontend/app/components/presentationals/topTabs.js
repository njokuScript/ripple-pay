import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
const TopTabs = (props) => {
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
    textAlign: 'center'
  };

  return (
    <View style={styles.topTabsContainer}>
      <TouchableOpacity
        onPress={props.handleLeftPress}
        style={Object.assign({}, topTabContainer, {borderRightWidth: 2, borderBottomWidth: !props.pressed ? 2 : 1})}
      >
        <Text 
          style={Object.assign({}, topTab, { color: !props.pressed ? "#2A4CED" : "black" })}>
        transactions
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.handleRightPress}
        style={Object.assign({}, topTabContainer, {borderBottomWidth: props.pressed ? 2 : 1})}
      >
        <Text style={Object.assign({}, topTab, { color: !props.pressed ? "black" : "#2A4CED" })}>
        orders
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topTabsContainer: {
    flex: -1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-around',
    borderWidth: .5,
    height: 40
  },
});

export default TopTabs;
