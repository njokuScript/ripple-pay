import { _ } from 'lodash';
import {
    Clipboard,
    Alert
} from 'react-native';

exports.truncate = function(num, decimalPlaces) {
    if (num === 0) {
        return 0;
    }
    return _.floor(num, decimalPlaces) || "";
};

exports.sanitize = function(input, type, maxLength) {
    if (typeof input !== type) {
        return false;
    }
    if (input.toString().length > maxLength) {
        return false;
    }
    return true;
};

exports.validRippleAddress = function(string) {
    return string.match(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/);
};

exports.validMoneyEntry = function(amount) {
    const amountString = amount.toString();
    return parseFloat(amount) && parseFloat(amount) > 0 && amountString.match(/\d+/);
};

// note: this will mess up the original ordering of the keys
exports.convertArrayOfObjectsToObject = function(array, extractKey, makeKeyUpperCase=false) {
    const result = {};
    array.forEach((obj) => {
        let key = obj[extractKey];
        if (makeKeyUpperCase) {
            key = key.toUppserCase();
        }
        result[key] = obj;
    });
    return result;
};

exports.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
};

exports.getQRCodeSource = function(address) {
    return `https://api.qrserver.com/v1/create-qr-code/?data=${address}`;
};

exports.clipBoardCopy = (string) => {
    Alert.alert(string, `copied to clipboard!`);
    Clipboard.setString(string);
    Clipboard.getString().then((str) => {
        return str;
    });
}