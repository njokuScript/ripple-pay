exports.CURRENT_STATE = 3;

exports.WALLETS = {
    'BANK_WALLET': 0,
    'PERSONAL_WALLET': 1
};

exports.APP_STATE = {
    'DEVELOPMENT': 0,
    'PRODUCTION': 1,
    'TEST_DEV': 2,
    'TEST_PROD': 3
};

exports.MIN_XRP_PER_WALLET = 20;

exports.ripplePayFee = 0.02;

if (exports.CURRENT_STATE === exports.APP_STATE.TEST_PROD || exports.CURRENT_STATE === exports.APP_STATE.PRODUCTION) {
    exports.API_URL = 'https://frozen-dusk-99773.herokuapp.com/v1';
    exports.email = "jonchaney@gmail.com";
    exports.password = "Password1!";
}

else if (exports.CURRENT_STATE === exports.APP_STATE.TEST_DEV || exports.CURRENT_STATE === exports.APP_STATE.DEVELOPMENT) {
    exports.API_URL = 'http://localhost:3000/v1';
    exports.email = "devanshpatel@gmail.com";
    exports.password = "Password1!!";
}

exports.MAX_EMAIL_LENGTH = 254;
exports.MAX_PASSWORD_LENGTH = 25;
exports.MIN_PASSWORD_LENGTH = 8;
exports.MAX_SCREEN_NAME_LENGTH = 30;