import React, { Component } from 'react';
import { connect } from 'react-redux';
import { unauthUser, comparePassword } from '../../actions';
import CustomInput from './customInput';
import CustomButton from './customButton';
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
            password: ""
        };
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.passwordAttempts.tries <= 0) {
            this.props.unauthUser();
        }
        if (nextProps.passwordAttempts.tries === this.props.passwordAttempts.tries) {
            this.props.enableSending();
        }
    }

    enterPassword() {
        const { password } = this.state;
        this.props.comparePassword(password);
        this.setState({ password: "" });
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
                />
                <View>
                    <Text style={{color: "white", textAlign: "center"}}>{this.props.passwordAttempts.tries} password attempts remaining</Text>
                </View>
                <CustomButton
                    performAction="enter password"
                    buttonColor="white"
                    handlePress={this.enterPassword}
                />
            </View>
        )
    }

}

const mapStateToProps = ({ user }) => ({
    passwordAttempts: user.passwordAttempts
});

const mapDispatchToProps = dispatch => ({
    unauthUser: () => dispatch(unauthUser()),
    comparePassword: (password) => dispatch(comparePassword(password))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordLock);