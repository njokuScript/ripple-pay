import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Dimensions
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanQR extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <QRCodeScanner 
                onRead={this.props.handleScan}
                cameraStyle={styles.cameraContainer} 
                topViewStyle={styles.zeroContainer}
                bottomViewStyle={styles.zeroContainer}
                style={{flex: 1}}
            />

        );
    }
}

const styles = StyleSheet.create({
    zeroContainer: {
        height: 0,
        flex: 0,
    },

    cameraContainer: {
        height: Dimensions.get('window').height,
    },
});

module.exports = ScanQR;