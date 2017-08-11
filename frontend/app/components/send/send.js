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

  render()
 {
   return (
     <View style={styles.mainContainer}>
       <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
           selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
         <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}><Text>Cloud</Text></TouchableOpacity><TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
         <Text>Source</Text></TouchableOpacity>
           <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
             <Text>Pool</Text>
           </TouchableOpacity>
         <Text name="Stream">Stream</Text>

     </Tabs>
     <Text style={styles.welcome}>
        Stream - Send your Ripple
     </Text>
     <Text style={styles.instructions}>
         Selected page: {this.state.page}
     </Text>
     <View>
         <TouchableOpacity onPress={this.onLogout}>
           <Text>logout</Text>
         </TouchableOpacity>
      </View>
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
