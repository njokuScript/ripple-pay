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
import Button from 'react-native-buttons';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/Octicons';



class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {page: "pool", amount: ""};
  }

  // componentDidMount(){
  //   this.props.requestAddressAndDesTag(this.props.user);
  // }

  navHome() {
    this.props.requestTransactions(this.props.user);
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
    });
  }


  oneDigit() {
    return;
  }

  twoDigit() {
    return;
  }

  threeDigit() {
    return;
  }

  fourDigit() {
    return;
  }

  fiveDigit() {
    return;
  }

  sixDigit() {
    return;
  }

  sevenDigit() {
    return;
  }

  eightDigit() {
    return;
  }

  nineDigit() {
    this.setState(

    )
  }

  zeroDigit() {
    return;
  }

  enterButton() {
    return;
  }

  backSpace() {
    return;
  }


  render()
  {
    let { amount } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{this.props.cashRegister}</Text>
        <Text style={styles.title}>{this.props.destinationTag}</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.keypadContainer}>
          <TextField

            placeholder="Enter Deposit"
            suffix="XRP"
            editable='true'
            value={amount}
            textColor="#E3305D"
            onChangeText={ (amount) => this.setState({ amount }) }
            />
          <View style={styles.keypadRow1}>
            <Button onPress={this.oneDigit.bind(this)}>1</Button>
            <Button onPress={this.twoDigit.bind(this)}>2</Button>
            <Button onPress={this.threeDigit.bind(this)}>3</Button>
          </View>
          <View style={styles.keypadRow2}>
            <Button onPress={this.fourDigit.bind(this)}>4</Button>
            <Button onPress={this.fiveDigit.bind(this)}>5</Button>
            <Button onPress={this.sixDigit.bind(this)}>6</Button>
          </View>
          <View style={styles.keypadRow3}>
            <Button onPress={this.sevenDigit.bind(this)}>7</Button>
            <Button onPress={this.eightDigit.bind(this)}>8</Button>
            <Button onPress={this.nineDigit.bind(this)}>9</Button>
          </View>
          <View style={styles.keypadRow4}>
            <Button onPress={this.enterButton.bind(this)}>Enter</Button>
            <Button onPress={this.zeroDigit.bind(this)}>0</Button>
            <Button onPress={this.backSpace.bind(this)}>Delete</Button>
          </View>
        </View>


        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
             onSelect={el=>this.setState({page:el.props.name})}>
          <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
            <Text>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
            <Text>Send</Text>
          </TouchableOpacity>
      </Tabs>


         <Text style={styles.welcome}>
            Pool - Store your Ripple
        </Text>
        <Text style={styles.instructions}>
            Selected page: {this.state.page}
        </Text>
 )
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#335B7B',
   },
   keypadContainer: {

     flexDirection: 'column',
   },
   keypadRow1: {
     flexDirection: 'row',
   },
   keypadRow2: {
     flexDirection: 'row',
   },
   keypadRow3: {
     flexDirection: 'row',
   },
   keypadRow4: {
     flexDirection: 'row',
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
