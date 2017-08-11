import React from 'react';
import HomeContainer from '../home/homeContainer';
import WalletContainer from '../wallet/walletContainer';
import SendContainer from '../send/send';
import { reduxForm } from 'redux-form';

import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput } from 'react-native';
  import Tabs from 'react-native-tabs';

import Icon from 'react-native-vector-icons/Octicons';
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {page: 'source'};
  }

  search(query) {
    // search database and render display results
  }

  displayResults(){

  }

  navHome() {
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }

  navSend() {
    this.props.navigator.push({
      title: 'Send',
      component: SendContainer,
      navigationBarHidden: true
    });
  }
  render()
 {
   return (
     <View style={styles.mainContainer}>
      <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
           onSelect={el=>this.setState({page:el.props.name})}>
        <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
         <Text>Search</Text>
        </TouchableOpacity>
          <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
            <Text>Deposit</Text>
          </TouchableOpacity>
        <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
          <Text>Send</Text>
      </TouchableOpacity>
     </Tabs>

     <View style={styles.inputContainer}>
     </View>
      <Text style={styles.welcome}>
         Source - Search for your Ripple contacts
     </Text>
     <Text style={styles.instructions}>
         Selected page: {this.state.page}
     </Text> 
     </View>

   );
 }}

 const {width, height} = Dimensions.get('window');
 const styles=StyleSheet.create({
   mainContainer: {
      flex: 1,
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
    inputContainer: {
      padding: 5,
      margin: 10,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: "white",
      backgroundColor: 'white'
    },
    input: {
      height: 26,
      backgroundColor: 'white'
    },
    instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
     fontSize: 15
   }
 });

 export default Search;
