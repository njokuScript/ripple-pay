import React from 'react';
import HomeContainer from '../home/homeContainer';
import SearchContainer from '../search/searchContainer';
import SendContainer from '../send/sendContainer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Tabs from 'react-native-tabs';
import Icon from 'react-native-vector-icons/Octicons';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {page: "pool"};
  }

  navHome() {
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navSend() {
    this.props.navigator.push({
      component: SendContainer,
      title: 'Send',
      navigationBarHidden: true
    })
  }



  render()
  {
    return (
      <View style={styles.mainContainer}>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
            selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
          <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}><Text>Cloud</Text></TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}><Text>Source</Text></TouchableOpacity>
              <Text>Pool</Text>
          <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}><Text>Strean</Text></TouchableOpacity>

      </Tabs>
        <Text style={styles.welcome}>
            Pool - Store your Ripple
        </Text>
        <Text style={styles.instructions}>
            Selected page: {this.state.page}
        </Text>
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={this.onLogout}>
            <Text>logout</Text>
          </TouchableOpacity>
       </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#335B7B',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
  title: {
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    fontFamily: 'Kohinoor Bangla',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 15
  }
});

export default Wallet;
