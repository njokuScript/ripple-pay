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

class Login extends React.Component {
  constructor(props){
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

  onSignIn() {
    let {dispatch, fields: {email, password}} = this.props;
    this.setState({
      loading: true
    });
    dispatch(loginUser(email.value, password.value)).then(() => {
      this.setState({
        loading: false
      });
    });
  }

  onSignUp() {
    let {dispatch, fields: {email, password, screenName}} = this.props;
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
      this.setState({enteringSite: true});
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
    let {fields: {email, password, screenName}} = this.props;

    let renderError = (field) => {
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
          {this.renderScreenName(screenName, renderError)}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.onSignIn}>
              <Text style={styles.button}>
                login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.enterSite}>
              <Text style={styles.button}>
                sign up
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
    paddingTop: 20,
    backgroundColor: '#335B7B',
  },

  titleContainer: {
    padding: 10,     
    alignItems: 'center',
  },

  title: {
    color: 'white',
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    flex: 1,
    top: 60,
    fontFamily: 'Kohinoor Bangla'
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
    fontFamily: 'Kohinoor Bangla'
  },

  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 100
  },
  button: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  formError: {
    color: 'red'
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
