import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';
import {configureStore} from './store/index';
import SearchContainer from './components/search/searchContainer';
import SettingsContainer from './components/settings/settingsContainer';
import WalletContainer from './components/wallet/walletContainer';
import ExchangeContainer from './components/exchange/exchangeContainer';
import HomeContainer from './components/home/homeContainer';
import BankSendContainer from './components/banksend/banksendContainer';
import TransitionContainer from './components/exchange/transitionContainer';
import SendRippleContainer from './components/exchange/sendRippleContainer';
import SendAmountContainer from './components/exchange/sendAmountContainer';
import PasswordLock from './components/presentationals/passwordLock';
import ShapeTransactionView from './components/presentationals/shapeTransactionView';
import AlertContainer from './components/alerts/AlertContainer';
import Alert from './components/alerts/Alert';
import App from './components/App';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';

let store = configureStore();

class StartApp {
    constructor() {
      this._populateIcons = this._populateIcons.bind(this);
      this.startTabs = this.startTabs.bind(this);
      this.startSingleApplication = this.startSingleApplication.bind(this);
      this.startTabApplication = this.startTabApplication.bind(this);
      this.makeRegistrations = this.makeRegistrations.bind(this);
    }

    _populateIcons = function () {
      return new Promise((resolve, reject) => {
        Promise.all(
          [
            Icon.getImageSource('home', 30),
            Icon.getImageSource('magnifying-glass', 30),
            Icon.getImageSource('wallet', 30),
            Icon.getImageSource('swap', 30),
            Icon2.getImageSource('ios-settings', 30),
          ]
        ).then((values) => {
          this.homeIcon = values[0];
          this.searchIcon = values[1];
          this.walletIcon = values[2];
          this.exchangeIcon = values[3];
          this.settingsIcon = values[4];
          resolve(true);
        }).catch((error) => {
          console.log(error);
          reject(error);
        }).done();
      });
    };

    makeRegistrations(){
      Navigation.registerComponent('Search', ()=> SearchContainer, store, Provider);
      Navigation.registerComponent('Settings', ()=> SettingsContainer, store, Provider);
      Navigation.registerComponent('Wallet', ()=> WalletContainer, store, Provider);
      Navigation.registerComponent('Exchange', ()=> ExchangeContainer, store, Provider);
      Navigation.registerComponent('Home', ()=> HomeContainer, store, Provider);
      Navigation.registerComponent('Banksend', ()=> BankSendContainer, store, Provider);
      Navigation.registerComponent('SendRipple', ()=> SendRippleContainer, store, Provider);
      Navigation.registerComponent('Transition', ()=> TransitionContainer, store, Provider);
      Navigation.registerComponent('SendAmount', ()=> SendAmountContainer, store, Provider);
      Navigation.registerComponent('Alert', ()=> Alert, store, Provider);
      Navigation.registerComponent('AlertContainer', ()=> AlertContainer, store, Provider);
      Navigation.registerComponent('PasswordLock', ()=> PasswordLock, store, Provider);
      Navigation.registerComponent('ShapeTransactionView', ()=> ShapeTransactionView, store, Provider);
      Navigation.registerComponent('App', ()=> App, store, Provider);
    }

    startTabs(){
      this._populateIcons().then(() => {
        // Start app only if all icons are loaded
        this.startTabApplication();
      }).catch((error) => {
        console.error(error);
      });
    }

    startSingleApplication(){
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'App',
          title: 'App',
          navigatorStyle: { navBarHidden: true, statusBarTextColorScheme: 'light'},
        }
      });
    }

    startTabApplication() {
  // this will start our app
      Navigation.startTabBasedApp({
        appStyle: {
          TextColorScheme: 'light'
        },
        tabs: [
          {
            label: 'Home',
            screen: 'Home',
            icon: this.homeIcon,
            selectedIcon: this.homeIcon,
            title: 'Home',
            navigatorStyle: {navBarHidden: true},
          },
          {
            label: 'Search',
            screen: 'Search',
            icon: this.searchIcon,
            selectedIcon: this.searchIcon,
            title: 'Search',
            navigatorStyle: {navBarHidden: true}
          },
          {
            label: 'Wallet',
            screen: 'Wallet',
            icon: this.walletIcon,
            selectedIcon: this.walletIcon,
            title: 'Wallet',
            navigatorStyle: {navBarHidden: true}
          },
          {
            label: 'Exchange',
            screen: 'Exchange',
            icon: this.exchangeIcon,
            selectedIcon: this.exchangeIcon,
            title: 'Exchange',
            navigatorStyle: {navBarHidden: true}
          },
          {
            label: 'Settings',
            screen: 'Settings',
            icon: this.settingsIcon,
            selectedIcon: this.settingsIcon,
            title: 'Settings',
            navigatorStyle: {navBarHidden: true}
          }
        ],
        tabsStyle: {
          tabBarSelectedButtonColor: "#111F61"
        }
      });
    }
  }

export default new StartApp();