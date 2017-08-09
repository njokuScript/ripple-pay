import React from 'react';
import {reduxForm} from 'redux-form';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {loginUser, signupUser, addAlert} from '../actions';

var Login = React.createClass({
  getInitialState: function() {
    return {
      loading: false
    };
  },
  onSignIn: function() {
    var {dispatch, fields: {email, password}} = this.props;
    this.setState({
      loading: true
    });
    dispatch(loginUser(email.value, password.value)).then(() => {
      this.setState({
        loading: false
      });
    });
  },
  onSignUp: function() {
    var {dispatch, fields: {email, password}} = this.props;
    this.setState({
      loading: true
    });
    dispatch(signupUser(email.value, password.value)).then(() => {
      this.setState({
        loading: false
      });
    });
  },
  render() {
    var {fields: {email, password}} = this.props;

    var renderError = (field) => {
      if (field.touched && field.error) {
        return (
          <Text style={styles.formError}>{field.error}</Text>
        );
      }
    };

    if (this.state.loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Loading...
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              ripplePay
            </Text>
          </View>
          <View style={styles.field}>
            <TextInput
              {...email}
              placeholder="Email"
              style={styles.textInput}/>
            <View>
              {renderError(email)}
            </View>
          </View>
          <View style={styles.field}>
            <TextInput
              {...password}
              placeholder="Password"
              style={styles.textInput}/>
            <View>
            {renderError(password)}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.onSignIn}>
              <Text style={styles.button}>
                login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onSignUp}>
              <Text style={styles.button}>
                sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 20,
    backgroundColor: '#335B7B',
  },

  titleContainer: {
    padding: 10,     
    alignItems: 'center',
    
  },

  title: {
    color: '#F2CFB1',
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    flex: 1,
    top: 60,
    fontFamily: 'Apple SD Gothic Neo'
    
  },

  field: {
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    margin: 45,
    marginTop: 0,
    top: 80,
    backgroundColor: '#fff'
  },

  textInput: {
    height: 26,
    fontFamily: 'Apple SD Gothic Neo'
  },

  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 100,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    
    
    shadowRadius: 1,

  },
  button: {
    fontSize: 30,
    color: '#F2CFB1',
    fontFamily: 'Copperplate',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
    borderBottomWidth: 0,
  
    shadowOpacity: 0.3,
    // shadowColor: '#000',
    padding: 7
  },
  formError: {
    color: 'red'
  }
});

var validate = (formProps) => {
  var errors = {};
  if (!formProps.email) {
    errors.email = "Please enter an email.";
  }
  if (!formProps.password) {
    errors.password = "Please enter a password.";
  }
  return errors;
};

module.exports = reduxForm({
  form: 'login',
  fields: ['email', 'password'],
  validate: validate
}, null, null)(Login);
