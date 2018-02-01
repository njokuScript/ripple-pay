import { connect } from 'react-redux';
import Transition from './transition';
import { 
  // requestMarketInfo, 
  addAlert,
  requestAllWallets, 
  requestOldAddress,
  getMinAmount,
  requestRate
} from '../../actions';

const mapStateToProps = ({ changelly, user }) => ({
  changelly: changelly,
  user: user
});

const mapDispatchToProps = dispatch => ({
  // requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  requestAllWallets: () => dispatch(requestAllWallets()),
  requestOldAddress: () => dispatch(requestOldAddress()),
  // minimum amount of fromCoin you can send
  getMinAmount: (fromCoin, toCoin) => dispatch(getMinAmount(fromCoin, toCoin)),
  // 1 coin is how much XRP
  requestRate: (coin) => dispatch(requestRate(coin))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition);
