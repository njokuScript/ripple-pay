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
    return;
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
    return (
      <View style={styles.mainContainer}>
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow1}>
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
          </View>
          <View style={styles.keypadRow2}>
            <Button>4</Button>
            <Button>5</Button>
            <Button>6</Button>
          </View>
          <View style={styles.keypadRow3}>
            <Button>7</Button>
            <Button>8</Button>
            <Button>9</Button>
          </View>
          <View style={styles.keypadRow4}>
            <Button>Enter</Button>
            <Button>0</Button>
            <Button>Delete</Button>
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
