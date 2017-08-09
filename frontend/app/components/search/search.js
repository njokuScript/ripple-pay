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
  }

  search(query) {
    // search database and render display results
  }

  displayResults(){

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
            {/* need to figure out how to do instant lookup
                once we have search implemented  */}
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(query) => { 

          }}
          placeholder="Enter Username"
          style={styles.input} />
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
    }
 });

 export default Search;
