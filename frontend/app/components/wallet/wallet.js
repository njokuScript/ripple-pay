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
    this.state = {
      page: "pool",
      disabled: false
    };
    this.generate = this.generate.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount(){
    this.props.requestAllWallets(this.props.user.user_id);
  }

  navHome() {
    // this.props.requestTransactions(this.props.user);
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

  remove(){
    if ( this.props.wallets.length > 0 )
    {
      this.setState({disabled: true});
      this.props.requestTransactions(this.props.user).then(() => this.props.delWallet(this.props.user.user_id, this.props.wallets[0], this.props.cashRegister)).then(()=> this.setState({disabled: false}));
    }
    else
    {
      return;
    }
  }

  //We have to disable the button so they can't generate more than 5 desTags

  generate(){
    let alltheWallets = this.props.wallets;
    if ( alltheWallets.length >= 0 && alltheWallets.length < 5 )
    {
      this.setState({disabled: true});
      if ( alltheWallets.length === 0 )
      {
        this.props.requestAddress(this.props.user.user_id)
        .then(()=> this.props.requestOnlyDesTag(this.props.user.user_id, this.props.cashRegister))
        .then(()=> this.setState({disabled: false}));
      }
      else
      {
        this.props.requestOnlyDesTag(this.props.user.user_id, this.props.cashRegister)
        .then(()=> this.setState({disabled: false}));
      }
    }
    else
    {
      return;
    }
  }


  displayWallets() {
    if (this.props.wallets.length > 0) {
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the wallets.
      const allWallets = this.props.wallets.map((wallet, idx) => {
        return (
          <View style={styles.wallet} key={idx}>
            <Text style={styles.walletFont}>{wallet}</Text>
          </View>
        );
      });
      return (
        <View style={styles.walletsContainer}>
          <Text>{this.props.cashRegister}</Text>
          {allWallets}
        </View>
      );
    } else {
      return (
        <View style={styles.wallet}>
          <Text style={styles.walletFont}>no wallets</Text>
        </View>
      );
    }
  }
  // <Text style={styles.title}>{this.props.cashRegister}</Text>
  // <Text style={styles.title}>{this.props.destinationTag}</Text>

  //I am removing wallets form earliest to latest. We can change this to just the one we click on later if we desire.

  render()
  {
    let disabled = this.state.disabled;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>
                Wallets
              </Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
          </View>
          <TouchableOpacity disabled={disabled} onPress={this.generate}>
            <Text style={disabled ? styles.redd : styles.greenn}>generate new wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={disabled} onPress={this.remove}>
            <Text style={disabled ? styles.redd : styles.greenn}>remove oldest wallet</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.walletsContainer}>
              {this.displayWallets()}
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
               <Text>Wallets</Text>
             </TouchableOpacity>
             <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
               <Text>Send</Text>
             </TouchableOpacity>
          </Tabs>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     flexDirection: 'column',
     backgroundColor: '#335B7B'
   },
   redd: {
     color: 'red',
     fontSize: 20
   },
   greenn: {
     color: 'green',
     fontSize: 20
   },
  topContainer: {
    alignItems: 'center',
    backgroundColor: '#335B7B',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowRadius: 3,
    // shadowOpacity: .5,
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: '#335B7B',
  },
  logo: {
    textAlign: 'center',
    marginTop: 25,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Kohinoor Bangla'
  },
   balance: {
     flex: 1,
     textAlign: 'center',
     fontSize: 40,
     color: 'white',
     fontFamily: 'Kohinoor Bangla'
   },
    walletsContainer: {
      flex: 1,
      // marginTop: 20,
      backgroundColor: 'white'
    },
    wallets: {
      flex: 1,
      fontFamily: 'Kohinoor Bangla',
    },
    wallet: {
      padding: 2,
      paddingLeft: 15,
      paddingTop: 15,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
    },
    tabFont: {
      color: 'white',
      fontFamily: 'Kohinoor Bangla',
    },
    tabs: {
      backgroundColor: '#335B7B',
      borderColor: '#d3d3d3',
      position: 'absolute',
      paddingTop: 15,
      paddingBottom: 10,
      height: 75
    }
});
// oneDigit() {
//   return;
// }
//
// twoDigit() {
//   return;
// }
//
// threeDigit() {
//   return;
// }
//
// fourDigit() {
//   return;
// }
//
// fiveDigit() {
//   return;
// }
//
// sixDigit() {
//   return;
// }
//
// sevenDigit() {
//   return;
// }
//
// eightDigit() {
//   return;
// }
//
// nineDigit() {
//   return;
// }
//
// zeroDigit() {
//   return;
// }
//
// enterButton() {
//   return;
// }
//
// backSpace() {
//   return;
// }



  // render(){
  //   return (
  //     <View style={styles.mainContainer}>
  //         {this.displayWallets()}
  //         <View style={styles.buttonContainer}>
  //           <TouchableOpacity onPress={this.generate}>
  //             <Text style={styles.button}>
  //               Generate Address/DesTAg
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //         <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
  //               onSelect={el=>this.setState({page:el.props.name})}>
  //               <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
  //                 <Text>Home</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
  //                 <Text>Search</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity>
  //                 <Text>Deposit</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
  //                 <Text>Send</Text>
  //               </TouchableOpacity>
  //         </Tabs>
  //     </View>
  //   )
  // }
  //I commented this out because this page we only need to give the user a deposit address and a destination Tag, that's it.
  // render()
  // {
  //   return (
  //     <View style={styles.mainContainer}>
  //       <View style={styles.keypadContainer}>
  //         <View style={styles.keypadRow1}>
  //           <Button>1</Button>
  //           <Button>2</Button>
  //           <Button>3</Button>
  //         </View>
  //         <View style={styles.keypadRow2}>
  //           <Button>4</Button>
  //           <Button>5</Button>
  //           <Button>6</Button>
  //         </View>
  //         <View style={styles.keypadRow3}>
  //           <Button>7</Button>
  //           <Button>8</Button>
  //           <Button>9</Button>
  //         </View>
  //         <View style={styles.keypadRow4}>
  //           <Button>Enter</Button>
  //           <Button>0</Button>
  //           <Button>Delete</Button>
  //         </View>
  //       </View>
  //
  //
  //       <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
  //            onSelect={el=>this.setState({page:el.props.name})}>
  //         <TouchableOpacity name="cloud" onPress={this.navHome.bind(this)}>
  //           <Text>Home</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity name="source" onPress={this.navSearch.bind(this)}>
  //           <Text>Search</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity>
  //           <Text>Deposit</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity name="Stream" onPress={this.navSend.bind(this)}>
  //           <Text>Send</Text>
  //         </TouchableOpacity>
  //       </Tabs>
  //
  //
  //        <Text style={styles.welcome}>
  //           Pool - Store your Ripple
  //       </Text>
  //       <Text style={styles.instructions}>
  //           Selected page: {this.state.page}
  //       </Text>
  //     </View>
  //   );
  // }
// }

// const { width, height } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   mainContainer: {
//      flex: 1,
//      justifyContent: 'center',
//      alignItems: 'center',
//      backgroundColor: '#335B7B',
//    },
//   buttonContainer: {
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     top: 60
//   },
//   button: {
//     fontSize: 30,
//     color: '#F2CFB1',
//     fontFamily: 'Kohinoor Bangla',
//     borderWidth: 1,
//     borderRadius: 6,
//     borderColor: '#ddd',
//     borderBottomWidth: 0,
//     shadowOpacity: 0.3,
//     padding: 7
//   },
//   walletsContainer: {
//     flex: 1,
//     // marginTop: 20,
//     backgroundColor: 'white'
//   },
//   wallets: {
//     flex: 1,
//     fontFamily: 'Kohinoor Bangla',
//   },
//   wallet: {
//     padding: 2,
//     paddingLeft: 15,
//     paddingTop: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderColor: '#d3d3d3',
//     backgroundColor: 'white',
//   },
// });

export default Wallet;

// keypadContainer: {
//
//   flexDirection: 'column',
// },
// keypadRow1: {
//   flexDirection: 'row',
// },
// keypadRow2: {
//   flexDirection: 'row',
// },
// keypadRow3: {
//   flexDirection: 'row',
// },
// keypadRow4: {
//   flexDirection: 'row',
// },
// welcome: {
//   fontSize: 20,
//   textAlign: 'center',
//   margin: 10,
// },
// title: {
//   color: 'white',
//   fontSize: 20,
//   justifyContent: 'center',
//   fontFamily: 'Kohinoor Bangla',
// },
// instructions: {
//   textAlign: 'center',
//   color: '#333333',
//   marginBottom: 5,
//   fontSize: 15
// },
