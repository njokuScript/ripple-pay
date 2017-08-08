import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NavigatorIOS
} from 'react-native';

import HomeContainer from './home/homeContainer';

var Main = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: HomeContainer,
          title: 'HomeContainer',
          navigationBarHidden: true
        }}
        style={{flex: 1}}/>
    );
  }
});

module.exports = Main;
