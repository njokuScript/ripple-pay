import React from 'react';
import { reduxForm } from 'redux-form';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { loginUser, signupUser, addAlert } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      enteringSite: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.renderScreenName = this.renderScreenName.bind(this);
    this.enterSite = this.enterSite.bind(this);
  }

  componentWillUnmount() {
    this.setState({
      loading: false
    });
  }

  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  onSignIn() {
    let { dispatch, fields: { email, password } } = this.props;
    this.setState({
      loading: true
    });
    dispatch(loginUser(email.value, password.value));
  }

  onSignUp() {
    let { dispatch, fields: { email, password, screenName } } = this.props;
    this.setState({
      loading: true
    });
    dispatch(signupUser(email.value, password.value, screenName.value)).then(() => {
      this.setState({
        loading: false
      });
    });
  }

  enterSite() {
    if (!this.state.enteringSite) {
      this.setState({ enteringSite: true });
    } else {
      return this.onSignUp();
    }
  }

  renderScreenName(screenName, renderError) {
    if (this.state.enteringSite) {
      return (
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
      );
    } else {
      return;
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

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          {this.renderScreenName(screenName, renderError)}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchableButton} onPress={this.onSignIn}>
              <Text style={styles.button}>
                SIGN IN
                </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.enterSite}>
              <Text style={styles.signUp}>
                Don't have an account? SIGN UP
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
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
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 35,
    marginBottom: 30,
    // padding: 20,
    flex: 1,
    top: 60,
    fontFamily: 'Kohinoor Bangla'
  },
  field: {
    backgroundColor: '#0F1C52',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 15,
    margin: 30,
    marginTop: 10,
    top: 80
  },
  textInput: {
    height: 40,
    fontFamily: 'Kohinoor Bangla',
    color: '#6D768B',
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 50
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
    top: 150,
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
