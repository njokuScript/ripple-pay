import React, { Component } from 'react';
import { connect } from 'react-redux';
import { unauthUser, comparePassword, clearAlerts, addAlert } from '../../actions';
import CustomInput from './customInput';
import CustomButton from './customButton';
import Validation from '../../utils/validation';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

class PasswordLock extends Component {
    constructor(props) {
        super(props);
        this.enterPassword = this.enterPassword.bind(this);
        this.state = {
            password: "",
            isDisabled: false
        };
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.passwordAttempts.tries <= 0) {
            this.props.unauthUser();
        }
        if (nextProps.passwordAttempts.tries === this.props.passwordAttempts.tries) {
            this.props.enableSending();
        }
        if (nextProps.passwordAttempts.tries === this.props.passwordAttempts.tries-1) {
            this.setState({ isDisabled: false });
        }
    }

    passwordValidations() {
        const validationErrors = [];

        validationErrors.push(...Validation.validateInput(Validation.TYPE.PASSWORD, this.state.password));

        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                this.props.addAlert(error);
            })
            return false;
        }

        return true;
    }

    enterPassword() {
        const { password } = this.state;
        if (!this.passwordValidations()) {
            return;
        }
        this.props.comparePassword(password).then(() => this.setState({ password: "" }));
        this.setState({ isDisabled: true });
    }

    button() {
        if (this.state.isDisabled) {
            return (
                <CustomButton
                    performAction="checking password..."
                    buttonColor="gray"
                    handlePress={this.enterPassword}
                    isDisabled={this.state.isDisabled}
                />
            );
        } else {
            return (
                <CustomButton
                    performAction="enter password"
                    buttonColor="white"
                    handlePress={this.enterPassword}
                    isDisabled={this.state.isDisabled}
                />
            );
        }

    }

    render() {
        return (
            <View>
                <CustomInput
                    placeholder="Password"
                    onChangeText={
                        (password) => {
                            this.setState({password: password});
                        }
                    }
                    autoCorrect={false}
                    placeholderTextColor="#6D768B"
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    keyboardAppearance={'dark'}
                    value={this.state.password}
                    autoFocus={true}
                />
                <View style={{marginTop: 15, marginBottom: -15}}>
                    <Text style={{color: "white", textAlign: "center", fontSize: 12}}>{this.props.passwordAttempts.tries} password attempts remaining</Text>
                </View>
                {this.button()}
            </View>
        );
    }

}

const mapStateToProps = ({ user }) => ({
    passwordAttempts: user.passwordAttempts
});

const mapDispatchToProps = dispatch => ({
    unauthUser: () => dispatch(unauthUser()),
    comparePassword: (password) => dispatch(comparePassword(password)),
    addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordLock);