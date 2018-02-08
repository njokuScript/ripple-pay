import React from 'react';
import AlertContainer from '../alerts/AlertContainer';
import Util from '../../utils/util';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Clipboard,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

class PersonalWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personalSecret: ''
        };
        this.generatePersonalAddress = this.generatePersonalAddress.bind(this);
        this.removePersonalAddress = this.removePersonalAddress.bind(this);
        this.setSecret = this.setSecret.bind(this);
    }

    componentWillUnmount() {
        this.setState({
            personalSecret: ''
        });
    }

    setSecret(secret) {
        this.setState({
            personalSecret: secret
        });
    }

    generatePersonalAddress() {
        if (!this.props.personalAddress) {
            this.props.genPersonalAddress(this.setSecret);
        }
    }

    removePersonalAddress() {
        if (this.props.personalAddress) {
            this.setState({
                personalSecret: ''
            });
            this.props.removePersonalAddress();
        }
    }

    clipBoardCopy(string) {
        Clipboard.setString(string);
        Clipboard.getString().then((str) => {
            return str;
        });
    }

    displayPersonalWallet() {
        const disabled = this.state.disabled;
        if (this.props.personalAddress) {
            const imageSource = Util.getQRCodeSource(this.props.personalAddress);
            console.log({uri: imageSource});
            return (
                <View style={styles.walletDisplay}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.image} underlayColor='#111F61' onPress={() => this.clipBoardCopy(this.props.personalAddress)}>
                            <View style={styles.qrBackground}>
                            <Image
                                style={styles.qrCode}
                                source={{ uri: imageSource }}
                            />
                            </View>
                            <View>
                                <Text style={styles.addressFont}>{this.props.personalAddress}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={styles.destTag}>
                            {this.state.personalSecret ? <Text style={styles.walletFont}>secret key: {this.state.personalSecret}</Text> : null}
                            <Text style={styles.walletFont}>Note: RipplePay does not store your Secret Key so please store it. You will need it to make payments.</Text>
                            <TouchableOpacity disabled={disabled} onPress={this.removePersonalAddress}>
                                <Text style={disabled ? styles.redButton : styles.greenButton}>Remove Personal Wallet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.noWalletsButtonsContainer}>
                    <TouchableOpacity disabled={disabled} onPress={this.generatePersonalAddress}>
                        <Text style={disabled ? styles.redButton : styles.greenButton}>Get Personal Wallet</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    barStyle="light-content"
                />
                {this.displayPersonalWallet()}
                <AlertContainer />
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#111F61',
    },
    imageContainer: {
        flex: 1,
        paddingTop: height / 25,
        alignItems: 'center',
        backgroundColor: '#111F61'
    },
    image: {
        flex: 1,
        alignItems: "center",
    },
    qrCode: {
        width: height / 4,
        height: height / 4,
    },
    qrBackground: {
        borderColor: 'white',
        borderWidth: 25

    },
    walletDisplay: {
        flex: 1,
        flexDirection: "column",
    },
    noWalletsButtonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    addressFont: {
        color: 'white',
        fontSize: height / 50,
        textAlign: 'center',
        marginTop: height / 50
    },
    redButton: {
        fontFamily: 'Kohinoor Bangla',
        color: 'red',
        backgroundColor: '#0F1C52',
        borderRadius: 25,
        padding: 16,
        width: 150,
        overflow: 'hidden',
        textAlign: 'center',
        fontSize: 15,
    },
    greenButton: {
        fontFamily: 'Kohinoor Bangla',
        backgroundColor: '#0F1C52',
        borderRadius: 25,
        padding: 16,
        width: 150,
        overflow: 'hidden',
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
    },
});

export default PersonalWallet;