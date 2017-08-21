import React from 'react';
import HomeContainer from '../home/homeContainer';
import WalletContainer from '../wallet/walletContainer';
import SendContainer from '../send/send';
import BankSendContainer from '../banksend/banksendContainer';
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
    this.requestUsers = this.props.requestUsers.bind(this);
    this.makeUsers = this.makeUsers.bind(this);
    this.navBankSend = this.navBankSend.bind(this);
    this.state = {
      query: "",
      page: 'source'
    };
  }

  componentDidUpdate(prevProps,prevState){
    if ( prevState.query !== this.state.query )
    {
      this.requestUsers(this.state.query);
    }
  }

  //I set the query to an empty string so that when this comes back it is an empty string we are searching for since none of the components
  //are unmounting with navigatorIOS. They just stay mounted.
  navHome() {
    // this.props.requestTransactions(this.props.user);
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  navBankSend(receiver_id, otherUser) {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'BankSend',
      component: BankSendContainer,
      navigationBarHidden: true,
      passProps: {receiver_id: receiver_id, otherUser: otherUser}
    });
  }

  navWallet() {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }
  //You can store a constant as stuff that is not wrapped in jsx tags

  navSend() {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Send',
      component: SendContainer,
      navigationBarHidden: true
    });
  }

//Disregard where your id is equal to the user id that comes back.
  makeUsers(){
    let theUsers;
    if ( this.props.users )
    {
      theUsers = this.props.users.sort((a,b) => a.screenName - b.screenName)
      .map((user, idx) => {
        if ( user._id !== this.props.user.user_id )
        {
          return (
            <TouchableOpacity onPress={() => {this.navBankSend(user._id, user.screenName)}} style={styles.resultItem} key={idx}>
              <Text style={styles.title}>    {user.screenName} - Click to Send</Text>
            </TouchableOpacity>
          );
        }
      });
      return theUsers;
    }
    else
    {
      return;
    }
  }

  render() {
    // const theUsers =
    // console.log(theUsers, "Iam here in render");
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
              <Text>Wallets</Text>
            </TouchableOpacity>
          <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
            <Text>Send</Text>
        </TouchableOpacity>
       </Tabs>
       <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={this.state.query}
              onChangeText={
                (query) => {
                  this.setState({query: query});
                }
              }
              autoFocus={true}
              placeholder="Enter Username"
              style={styles.input} />
          </View>
          <View style={styles.resultsContainer}>
            {/* i made a conditional in this results to try to print the results only when they are in the state,
                not working, but close i think  */}
            {this.makeUsers()}
          </View>
        </View>
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
      marginTop: 30,
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
   },
    resultItem: {
      flex: 1,
    },
    resultContainer: {
      flex: 1,
      margin: 30
    }
 });

 export default Search;
