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
    this.requestUsers = this.props.requestUsers.bind(this);
    this.makeUsers = this.makeUsers.bind(this);
    this.state = {
      query: "",
    };
  }

  // componentWillReceiveProps(newProps){
  //   console.log(this.props.users.data.search);
  //   console.log(newProps.users.data.search);
  //   if ( this.props.users.data.search !== newProps.users.data.search )
  //   {
  //     this.setState({ results: newProps.users.data.search });
  //   }
  // }

  componentDidUpdate(prevProps,prevState){
    // console.log("I updated")
    if ( prevState.query !== this.state.query )
    {
      this.requestUsers(this.state.query)
    }
  }

  backToHome() {
    this.props.navigator.pop();
  }
  //You can store a constant as stuff that is not wrapped in jsx tags

  makeUsers(){
    let theUsers;
    if ( this.props.users )
    {
      theUsers = this.props.users.map((user, idx) => {
        return (
          <View style={styles.resultItem} key={idx}>
            <Text style={styles.title}>{user}</Text>
          </View>
        );
      });
      return theUsers;
    }
    else
    {
      return
    }
  }

  render() {
    // const theUsers =
    // console.log(theUsers, "Iam here in render");
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
