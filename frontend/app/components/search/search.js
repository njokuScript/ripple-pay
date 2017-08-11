import React from 'react';
import { reduxForm } from 'redux-form';

import { View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
class Search extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.requestUsers = this.props.requestUsers.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.state = {
      query: ""
    };
  }

  displayResults(){
    // i am trying to make it not print .map undefined, but when i do this it never updates the state
    // with the search results
    // i am using length === 0 as the test case because this is the deafault state
    if (this.props.users.length === 0) {
      return;
    } else {
    // our state shape is weird, this is where the results populate
    // this.props.users.data.search, believe me, i saw them print to the app
    const selectedUsers = this.props.users.data.search.map((user, idx) => {
      return (
        <View style={styles.resultItem} key={idx}>
          <Text style={styles.title}>{user}</Text>
        </View>
      );
    });

    return (
      <View style={styles.resultContainer}>
        {selectedUsers}
      </View>
    );
    }
  }

  backToHome() {
    this.props.navigator.pop();
  }

  render()
 {
   return (
     <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={this.backToHome.bind(this)}>
          <Icon name="chevron-left" size={20} color="white"> </Icon>
        </TouchableOpacity>
       <Text style={styles.title}> 
          Search
       </Text>
       <Text> 
         {/* not sure how to make content align properly without this.
             need better understanding of flex-box  */}
       </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(query) => { 
            this.setState({query: query});
            this.requestUsers(this.state.query);
          }}
          placeholder="Enter Username"
          style={styles.input} />
      </View>
      <View style={styles.resultsContainer}>
        {/* i made a conditional in this results to try to print the results only when they are in the state,
            not working, but close i think  */}
        {this.displayResults()}
      </View>
     </View>
   );
 }}

 const {width, height} = Dimensions.get('window');
 const styles=StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'flex-start',
     alignItems: 'stretch',
     backgroundColor: '#335B7B'
   },
    topBar: {
      padding: 12,
      paddingTop:28,
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
    resultItem: {
      flex: 1
    },
    resultContainer: {
      flex: 1
    }
 });

 export default Search;
