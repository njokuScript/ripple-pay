import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const TopTabs = (props) => {
  const topTabContainer = {
    borderColor: 'black',
    width: 160,
    height: 40,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
  return (
    <View style={styles.topTabsContainer}>
      <TouchableOpacity
        onPress={props.handleLeftPress}
        style={Object.assign({}, topTabContainer, {borderRightWidth: 2, borderBottomWidth: props.pressed ? 2 : 1})}
      >
        <Text style={styles.topTab}>
        XRP
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.handleRightPress}
        style={Object.assign({}, topTabContainer, {borderBottomWidth: !props.pressed ? 2 : 1})}
      >
        <Text style={styles.topTab}>
        Conversions
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  topTabsContainer: {
    flex: -1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-around',
    borderColor: 'black',
    borderWidth: 1,
    height: 40
  },

  topTabContainerRight: {
    borderColor: 'black',
    borderBottomWidth: 1,
    // borderTopWidth: 3,
    width: 160,
    height: 40,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white'
  },
  topTab: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Kohinoor Bangla'
  }
})

export default TopTabs;
