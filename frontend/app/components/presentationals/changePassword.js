import React, { Component } from 'react';
import { connect } from 'react-redux';
import { unauthUser, changePassword, clearAlerts } from '../../actions';
import AlertContainer from '../alerts/AlertContainer';
import CustomInput from './customInput';
import CustomButton from './customButton';
import CustomBackButton from './customBackButton';
import { addAlert } from '../../actions';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.changePassword = this.changePassword.bind(this);
        this.state = {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
            isDisabled: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.passwordAttempts.tries <= 0) {
            this.props.unauthUser();
        }
    }

    changePassword() {
        const { oldPassword, newPassword, newPasswordConfirm } = this.state;
        if (newPassword === newPasswordConfirm) {
            this.props.changePassword(oldPassword, newPassword).then(() => this.setState({ password: "" }));
            this.setState({ isDisabled: true });
        }
        else {
            this.props.addAlert("New password and confirmation do not match!");
        }
    }

    button() { 
        return (
            <CustomButton
                performAction="change password"
                buttonColor="white"
                handlePress={this.changePassword}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomBackButton handlePress={() => this.props.navigator.pop({
                    animationType: 'fade'
                })} />
                <CustomInput
                    placeholder="Old Password"
                    onChangeText={
                        (oldPassword) => {
                            this.setState({ oldPassword });
                        }
                    }
                    autoCorrect={false}
                    placeholderTextColor="#6D768B"
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    keyboardAppearance={'dark'}
                    value={this.state.oldPassword}
                    autoFocus={true}
                />
                <CustomInput
                    placeholder="New Password"
                    onChangeText={
                        (newPassword) => {
                            this.setState({ newPassword });
                        }
                    }
                    autoCorrect={false}
                    placeholderTextColor="#6D768B"
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    keyboardAppearance={'dark'}
                    value={this.state.newPassword}
                />
                <CustomInput
                    placeholder="Confirm New Password"
                    onChangeText={
                        (newPasswordConfirm) => {
                            this.setState({ newPasswordConfirm });
                        }
                    }
                    autoCorrect={false}
                    placeholderTextColor="#6D768B"
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    keyboardAppearance={'dark'}
                    value={this.state.newPasswordConfirm}
                />
                <View style={{ marginTop: 15, marginBottom: -15 }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>{this.props.passwordAttempts.tries} password attempts remaining</Text>
                </View>
                { this.button() }
                <AlertContainer />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#111F61',
        paddingTop: 20
    }
});


const mapStateToProps = ({ user }) => ({
    passwordAttempts: user.passwordAttempts
});

const mapDispatchToProps = dispatch => ({
    unauthUser: () => dispatch(unauthUser()),
    changePassword: (oldPassword, newPassword) => dispatch(changePassword(oldPassword, newPassword)),
    addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);