import { connect } from 'react-redux';
import SendAmount from './sendAmount';
import { requestMarketInfo, sendAmount } from '../../actions/shapeActions';
import { addAlert } from '../../actions/alertsActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape,
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  sendAmount: (amount, withdrawal, pair, returnAddress, destTag) => dispatch(sendAmount(amount, withdrawal, pair, returnAddress, destTag))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendAmount);
