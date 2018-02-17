import Config from '../config_enums';

exports.TYPE = {
    EMAIL: 0,
    SCREEN_NAME: 1,
    PASSWORD: 2,
    MONEY: 3,
    RIPPLE_ADDRESS: 4,
    DESTINATION_TAG: 5,
    SECRET_KEY: 6
};

const validationMap = {};

validationMap[exports.TYPE.EMAIL] = (email) => {
    const errorMessages = [];
    if (email.length > Config.MAX_EMAIL_LENGTH) {
        errorMessages.push(`Email Length must be less than ${Config.MAX_EMAIL_LENGTH}`);
    }
    if (!(/\S+@\S+\.\S+/).test(email)) {
        errorMessages.push("Email is not in correct email form");
    }
    return errorMessages;
};

validationMap[exports.TYPE.SCREEN_NAME] = (screenName) => {
    const errorMessages = [];
    if (screenName.length > Config.MAX_SCREEN_NAME_LENGTH) {
        errorMessages.push(`Screen Name Length must be less than ${Config.MAX_SCREEN_NAME_LENGTH}`);
    }
    if ((/^[0-9]/).test(screenName)) {
        errorMessages.push('Screen Name cannot start with a number');
    }
    else if (!(/^[a-zA-Z][0-9a-zA-Z]+$/).test(screenName)) {
        errorMessages.push('Screen Name cannot have any symbols');
    }
    return errorMessages;
};

validationMap[exports.TYPE.PASSWORD] = (password) => {
    const errorMessages = [];
    if (password.length > Config.MAX_PASSWORD_LENGTH) {
        errorMessages.push(`Password Length must be less than ${Config.MAX_PASSWORD_LENGTH}`);
    }
    if (password.length < Config.MIN_PASSWORD_LENGTH) {
        errorMessages.push(`Password Length must be more than ${Config.MIN_PASSWORD_LENGTH}`);
    }
    if ((/\s/).test(password)) {
        errorMessages.push('Password cannot contain spaces');
    }
    if ((/\=/).test(password)) {
        errorMessages.push('Password cannot contain (=) symbol');
    }
    return errorMessages;
};

validationMap[exports.TYPE.RIPPLE_ADDRESS] = (rippleAddress) => {
    const errorMessages = [];
    if (!(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).test(rippleAddress)) {
        errorMessages.push('Not a valid ripple address');
    }
    return errorMessages;
};

validationMap[exports.TYPE.DESTINATION_TAG] = (destTag) => {
    const errorMessages = [];
    if (!(/^\d+$/).test(destTag)) {
        errorMessages.push('Destination tag must be numerical');
    }
    else if ( parseInt(destTag) < 1 || parseInt(destTag) > 4294967294) {
        errorMessages.push('Destination tag must be between 1 and 4294967294');
    }
    return errorMessages;
};

validationMap[exports.TYPE.SECRET_KEY] = (secretKey) => {
    const errorMessages = []
    if (secretKey.length === 0 || !(/^[a-zA-Z0-9]+$/).test(secretKey)) {
        errorMessages.push('Not a valid ripple secret key');
    }
    return errorMessages;
};

validationMap[exports.TYPE.MONEY] = (amount) => {
    const errorMessages = [];
    if (isNaN(parseFloat(amount))) {
        errorMessages.push("Amount input is improper");
    }
    if (!(/^\d*\.{0,1}\d+$/).test(amount) || parseFloat(amount) <= 0) {
        errorMessages.push("Amount must be a number more than 0");
    }
    return errorMessages;
};

exports.validateInput = (type, input) => {
    return validationMap[type](input);
};