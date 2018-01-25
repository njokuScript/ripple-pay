import { XRP_TO_USD_URL, ALL_COINS_MARKET_URL } from '../api';
import axios from 'axios';

exports.getXRPtoUSD = (xrpBalance, setUSD) => {
    axios.get(XRP_TO_USD_URL).then((response) => {
        const usdPerXRP = response.data.price;
        const usdBalance = usdPerXRP*xrpBalance;
        setUSD(usdBalance, usdPerXRP);
    });
};

exports.getAllMarketCoins = () => {
    return axios.get(ALL_COINS_MARKET_URL).then((response) => {
        const coins = response.data;
        return coins;
    });
};