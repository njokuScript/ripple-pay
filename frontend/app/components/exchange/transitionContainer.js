import { connect } from 'react-redux';
import Transition from './transition';
import { 
  createChangellyTransaction,
  addAlert,
  getMinAmount,
  requestRate
} from '../../actions';

const mapStateToProps = ({ changelly, user }) => ({
  changelly: changelly,
  user: user,
  activeWallet: user.activeWallet
});

const mapDispatchToProps = dispatch => ({
  addAlert: (message) => dispatch(addAlert(message)),
  getMinAmount: (fromCoin, toCoin) => dispatch(getMinAmount(fromCoin, toCoin)),
  requestRate: (coin) => dispatch(requestRate(coin)),
  createChangellyTransaction: (from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag) => dispatch(createChangellyTransaction(from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition);
