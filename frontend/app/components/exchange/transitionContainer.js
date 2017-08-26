import { connect } from 'react-redux';
import Transition from './transition';
import { requestMarketInfo } from '../../actions/shapeActions';
import { addAlert } from '../../actions/alertsActions';
import { requestAllWallets } from '../../actions/authActions';

const mapStateToProps = ({ shape, user }) => ({
  shape: shape,
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  requestAllWallets: (user_id) => dispatch(requestAllWallets(user_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition);
