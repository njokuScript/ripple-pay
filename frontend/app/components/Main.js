import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NavigatorIOS
} from 'react-native';

import HomeContainer from './home/homeContainer';

export default class Main extends React.Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: HomeContainer,
          title: 'HomeContainer',
          navigationBarHidden: true
        }}
        style={{ flex: 1 }}
      />
    );
  }
}

