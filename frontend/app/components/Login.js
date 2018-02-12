import React from 'react';
import { reduxForm } from 'redux-form';
import CustomInput from './presentationals/customInput';
import CustomButton from './presentationals/customButton';
import AlertContainer from './alerts/AlertContainer';
import Validation from '../utils/validation';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Config from '../config_enums';

import { loginUser, signupUser, addAlert } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extraField: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.toggleField = this.toggleField.bind(this);
  }
  // THIS CONFIG STUFF IS LEFT IN HERE SOLELY FOR DEBUGGING PURPOSES AND MUST BE REMOVED LATER.
  // ALL THE CONFIG STUFF HAS TO BE REMOVED LATER.
  componentDidMount() {
    if (Config.email && Config.password) {
      this.onSignIn();
    }
  }

  onSignIn() {
    let { dispatch, fields: { email, password } } = this.props;
    // the following is only to allow for easier testing and must be removed later.
    if (Config.email && Config.password) {
      email.value = Config.email;
      password.value = Config.password;
    }
    const validationErrors = [];

    validationErrors.push(...Validation.validateInput(Validation.TYPE.EMAIL, email.value));
    validationErrors.push(...Validation.validateInput(Validation.TYPE.PASSWORD, password.value));

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        dispatch(addAlert(error));
      })
      return;
    }
    dispatch(loginUser(email.value, password.value));
  }

  onSignUp() {
    let { dispatch, fields: { email, password, screenName } } = this.props;
    const validationErrors = [];

    validationErrors.push(...Validation.validateInput(Validation.TYPE.EMAIL, email.value));
    validationErrors.push(...Validation.validateInput(Validation.TYPE.PASSWORD, password.value));
    validationErrors.push(...Validation.validateInput(Validation.TYPE.SCREEN_NAME, screenName.value));

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        dispatch(addAlert(error));
      })
      return;
    }
    dispatch(signupUser(email.value, password.value, screenName.value));
  }

  renderButton(screenName, renderError) {
    if (this.state.extraField) {
      return (
        <View style={styles.remainingContainer}>
          <CustomInput
            {...screenName}
            placeholder="Screen Name"
            placeholderTextColor="#6D768B"
            errorText={renderError(screenName)}
          />
          <CustomButton
            performAction="SIGN UP"
            handlePress={this.onSignUp}
            isDisabled={false}
            buttonColor="white"
          />
          <Text style={styles.signUpView} onPress={this.toggleField}>
            Already have an account? SIGN IN
          </Text>
        </View>
      );
    } else {
      return (
      <View style={styles.remainingContainer}>
        <CustomButton
          performAction="SIGN IN"
          handlePress={this.onSignIn}
          isDisabled={false}
          buttonColor="white"
        />
        <Text style={styles.signUpView} onPress={this.toggleField}>
          Don't have an account? SIGN UP
        </Text>
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
        <AlertContainer />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            RipplePay
          </Text>
        </View>
        <CustomInput
          {...email}
          placeholder="Email"
          placeholderTextColor="#6D768B"
          errorText={renderError(email)}
        />
        <CustomInput
          {...password}
          placeholder="Password"
          placeholderTextColor="#6D768B"
          secureTextEntry={true}
          errorText={renderError(password)}
        />
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
    marginTop: 10,
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginBottom: 30,
    textAlign: 'center',
    // flex: 1,
    top: 30,
    fontFamily: 'Kohinoor Bangla'
  },
  formError: {
    color: 'red',
    fontSize: 12
  },
  signUpView: {
    color: 'white',
    top: 5,
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
