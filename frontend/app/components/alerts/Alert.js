import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import { removeAlert } from '../../actions/alertsActions';

class Alert extends React.Component {
  constructor(props){
    super(props);
  }
  onRemoveAlert() {
    let {dispatch, alert} = this.props;
    dispatch(removeAlert(alert.id));
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onRemoveAlert.bind(this)}>
        <View style={styles.container}>
          <Text style={styles.text}>
            {this.props.alert.text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#ebccd1',
  },
  text: {
    color: "red",
    textAlign: "center"
  }
});

module.exports = connect()(Alert);
