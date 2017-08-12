import React from 'react';
import HomeContainer from '../home/homeContainer';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';

import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput } from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';


class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {page: 'stream'};
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
    title: 'Search',
    component: SearchContainer,
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

sendRipple() {
  return;
}

requestRipple() {
  return;
}



  render()
 {
   return (
     <View style={styles.mainContainer}>
       <View style={styles.buttonContainer}>
         <Button style={styles.button} onPress={this.sendRipple.bind(this)}>Send</Button>
         <Button style={styles.button} onPress={this.requestRipple.bind(this)}>Request</Button>
       </View>
       <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
           onSelect={el=>this.setState({page:el.props.name})}>

         <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
           <Text>Home</Text>
        </TouchableOpacity>

          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
          <Text>Search</Text>
         </TouchableOpacity>

           <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
             <Text>Deposit</Text>
           </TouchableOpacity>

           <TouchableOpacity>
              <Text>Send</Text>
          </TouchableOpacity>
     </Tabs>

      <Text style={styles.welcome}>
        Stream - Send your Ripple
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#335B7B',
    },
    buttonContainer: { //Needs proper flexing from jon

      flexDirection: 'row',
      // margin: 8
    },
    button: {

      justifyContent: 'space-around',
      padding: 14,
      margin: 7,
      backgroundColor: '#E8C25E',
      borderRadius: 6,

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

 export default Send;
