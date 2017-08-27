import { connect } from 'react-redux';
import SendAmount from './sendAmount';
import { requestMarketInfo, sendAmount, shapeshift } from '../../actions/shapeActions';
import { addAlert } from '../../actions/alertsActions';
import { signAndSend } from '../../actions/authActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape,
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  sendAmount: (amount, withdrawal, pair, returnAddress, destTag) => dispatch(sendAmount(amount, withdrawal, pair, returnAddress, destTag)),
  signAndSend: (amount, fromAddress, toAddress, sourceTag, toDesTag, userId) => dispatch(
    signAndSend(amount, fromAddress, toAddress, sourceTag, toDesTag, userId)
  ),
  shapeshift: (withdrawal, pair, returnAddress, destTag) => dispatch(shapeshift(withdrawal, pair, returnAddress, destTag))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendAmount);
