import React from 'react';
import HomeContainer from '../home/homeContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import BankSendContainer from '../banksend/banksendContainer';
import AlertContainer from '../alerts/AlertContainer';
import CustomInput from '../presentationals/customInput';
import Validation from '../../utils/validation';

import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.requestUsers = this.props.requestUsers.bind(this);
    this.makeUsers = this.makeUsers.bind(this);
    this.navBankSend = this.navBankSend.bind(this);
    this.state = {
      query: "",
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "didDisappear" )
    {
      this.setState({query: ""});
    }
  }

  userSearchValidations() {
    let { query } = this.state;
    
    if (query.length === 0) {
      return true;
    }
    if (query.length === 1) {
      if (query.match(/[a-zA-Z]/)) {
        return true;
      }
      this.props.addAlert("First letter must be alphabetical");
      return false;
    }

    const validationErrors = [];
    validationErrors.push(...Validation.validateInput(Validation.TYPE.SCREEN_NAME, query));

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        this.props.addAlert(error);
      })
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState){
    if ( prevState.query !== this.state.query )
    {
      if (!this.userSearchValidations()) {
        return;
      }

      this.requestUsers(this.state.query);
    }
  }

  navBankSend(receiverScreenName) {
    this.props.navigator.push({
      backButtonTitle: "",
      screen: 'Banksend',
      passProps: { receiverScreenName },
      animation: true,
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true, statusBarTextColorScheme: 'light'
      },
    });
  }

// Disregard where your id is equal to the user id that comes back.
  makeUsers(){
    let theUsers;
    if ( this.props.users )
    {
      theUsers = this.props.users.sort()
      .map((screenName, idx) => {
        return (
            <TouchableOpacity key={idx} style={styles.resultItem} onPress={() => { this.navBankSend(screenName); }}>
              <View style={styles.username}>
                <Text style={styles.resultItemText}>{screenName}</Text>
              </View>
            </TouchableOpacity>
        );
      });
      return (
        <ScrollView style={styles.resultsContainer}>
         {theUsers}
       </ScrollView>
      );
    }
    else
    {
      return;
    }
  }

  render() {
   return (
     <View style={styles.mainContainer}>
       <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <CustomInput
            value={this.state.query}
            onChangeText={
              (query) => {
                this.setState({query: query});
              }
            }
            placeholder="Enter Username"
            placeholderTextColor="#6D768B"
            keyboardAppearance={'dark'}
          />
        </View>
       </View>
        <ScrollView>
          {this.makeUsers()}
        </ScrollView>
        <AlertContainer />
     </View>
   );
 }}

 const {width, height} = Dimensions.get('window');
 const styles=StyleSheet.create({
   mainContainer: {
     backgroundColor: 'white'
   },
   topContainer: {
     backgroundColor: '#111F61',
     height: height / 5.5,
   },
   searchContainer: {
    justifyContent: "center",
    flex: 1,
   },
    title: {
      color: 'white',
      fontSize: 20,
      justifyContent: 'center',
      fontFamily: 'AppleSDGothicNeo-Light',
    },
    resultsContainer: {
      flex: 1,
      marginBottom: 75
    },
    resultItemText: {
      fontWeight: "600",
      fontSize: 15,
      backgroundColor: 'white'
    },
    resultItem: {
      flex: 1,
      padding: 2,
      paddingTop: 15.65,
      paddingBottom: 15.65,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
      width: width,
      paddingLeft: 15,
    },
 });

 export default Search;
