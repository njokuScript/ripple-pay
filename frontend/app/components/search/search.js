import React from 'react';
// import searchContainer from './searchContainer';

import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  onSearch() {
    return;
  }

  render()
 {
   return (
     <View style={styles.searchBarContainer}>
      <Text style={styles.searchHeader}>
      Search Header
      </Text>
     </View>
   )
 }};

 const {width, height} = Dimensions.get('window');
 const styles=StyleSheet.create({

 });

 export default Search;
