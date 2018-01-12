import { connect } from 'react-redux';
import Transition from './transition';
import { 
  requestMarketInfo, 
  addAlert,
  requestAllWallets, 
  requestOldAddress 
} from '../../actions';

const mapStateToProps = ({ shape, user }) => ({
  shape: shape,
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  requestAllWallets: () => dispatch(requestAllWallets()),
  requestOldAddress: () => dispatch(requestOldAddress())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition);
