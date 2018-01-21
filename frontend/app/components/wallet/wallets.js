import React from 'react';
import { connect } from 'react-redux';
import Config from '../../config_enums';
import Wallet from './walletContainer';
import PersonalWallet from './personalWalletContainer';

import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';

export default class Wallets extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.activeWallet === Config.WALLETS.BANK_WALLET) {
            return <Wallet />;
        }
        else if (this.props.activeWallet === Config.WALLETS.PERSONAL_WALLET) {
            return <PersonalWallet />;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: '#ccc'
    },
});

let mapStateToProps = (state) => {
    return {
        activeWallet: state.user.activeWallet
    };
};

module.exports = connect(mapStateToProps, null)(Wallets);