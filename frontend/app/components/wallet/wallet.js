import React from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Octicons';
class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }

  backToHome() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={this.backToHome.bind(this)}>
            <Icon name="chevron-left" size={20} color="white"> </Icon>
          </TouchableOpacity>
          <Text style={styles.title}>
            Deposit
       </Text>
          <Text>
            {/* not sure how to make content align properly without this.
             need better understanding of flex-box  */}
          </Text>
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#335B7B'
  },
  topBar: {
    padding: 12,
    paddingTop: 28,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    fontFamily: 'Kohinoor Bangla',
  }
});

export default Wallet;
