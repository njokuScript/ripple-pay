import React from 'react';
import { reduxForm } from 'redux-form';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { loginUser, signupUser, addAlert } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extraField: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.toggleField = this.toggleField.bind(this);
  }

  onSignIn() {
    let { dispatch, fields: { email, password } } = this.props;
    dispatch(loginUser(email.value, password.value))
  }

  onSignUp() {
    let { dispatch, fields: { email, password, screenName } } = this.props;
    dispatch(signupUser(email.value, password.value, screenName.value))
  }

  renderButton(screenName, renderError) {
    if (this.state.extraField) {
      return (
        <View style={styles.remainingContainer}>
          <View style={styles.field}>
            <TextInput
              {...screenName}
              placeholder="Screen Name"
              placeholderTextColor="#6D768B"
              style={styles.textInput} />
            <View>
              {renderError(screenName)}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchableButton} onPress={this.onSignUp}>
              <Text style={styles.button}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.toggleField}>
            <Text style={styles.signUpView}>
              Already have an account? SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
      <View style={styles.remainingContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.touchableButton} onPress={this.onSignIn}>
            <Text style={styles.button}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.toggleField}>
          <Text style={styles.signUpView}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
      );
    }
  }

  toggleField() {
    if (!this.state.extraField)
    {
      this.setState({ extraField: true });
    }
    else
    {
      this.setState({ extraField: false });
    }
  }


  render() {
    let { fields: { email, password, screenName } } = this.props;

    let renderError = (field) => {
      if (field.touched && field.error) {
        return (
          <Text style={styles.formError}>{field.error}</Text>
        );
      }
    };
    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#4c69a5' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            ripplePay
            </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            {...email}
            placeholder="Email"
            placeholderTextColor="#6D768B"
            style={styles.textInput} />
          <View>
            {renderError(email)}
          </View>
        </View>
        <View style={styles.field}>
          <TextInput
            {...password}
            placeholder="Password"
            placeholderTextColor="#6D768B"
            secureTextEntry={true}
            style={styles.textInput} />
          <View>
            {renderError(password)}
          </View>
        </View>
        {this.renderButton(screenName, renderError)}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#111F61',
  },
  titleContainer: {
    padding: 10,
    // alignItems: 'center',
  },
  remainingContainer: {
    marginTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginBottom: 30,
    textAlign: 'center',
    // flex: 1,
    top: 70,
    fontFamily: 'Kohinoor Bangla'
  },
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 15,
    margin: 30,
    marginTop: 10,
    top: 90
  },
  textInput: {
    height: 40,
    fontFamily: 'Kohinoor Bangla',
    color: '#6D768B',
  },
  buttonContainer: {
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 80
  },
  touchableButton: {
    backgroundColor: '#0F1C52',
    borderRadius: 50,
    paddingTop: 10,
    paddingBottom: 10,
    width: 250,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    textAlign: 'center'
  },
  formError: {
    color: 'red',
    fontSize: 12
  },
  signUp: {
    color: 'white',
    top: 225,
    textAlign: 'center'
  },
  signUpView: {
    color: 'white',
    top: 85,
    textAlign: 'center'
  }

});

let validate = (formProps) => {
  let errors = {};
  if (!formProps.email) {
    errors.email = "Please enter an email.";
  }
  if (!formProps.password) {
    errors.password = "Please enter a password.";
  }
  if (!formProps.screenName) {
    errors.screenName = "Please enter a screen name.";
  }
  return errors;
};

module.exports = reduxForm({
  form: 'login',
  fields: ['email', 'password', 'screenName'],
  validate: validate
}, null, null)(Login);
