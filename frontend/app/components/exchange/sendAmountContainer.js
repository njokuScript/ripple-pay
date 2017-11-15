import { connect } from 'react-redux';
import SendAmount from './sendAmount';
import {
  requestMarketInfo,
  sendAmount,
  shapeshift,
  makeShapeshiftTransaction,
  clearSendAmount
 } from '../../actions/shapeActions';
import { addAlert } from '../../actions/alertsActions';
import { signAndSend } from '../../actions/authActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape,
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  sendAmount: (amount, withdrawal, pair, returnAddress, destTag) => dispatch(sendAmount(amount, withdrawal, pair, returnAddress, destTag)),
  signAndSend: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    signAndSend(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  shapeshift: (withdrawal, pair, returnAddress, destTag) => dispatch(shapeshift(withdrawal, pair, returnAddress, destTag)),
  makeShapeshiftTransaction: (
    userId, from, to, otherParty, shapeShiftAddress, refundAddress, orderId
  ) => dispatch(makeShapeshiftTransaction(
    userId, from, to, otherParty, shapeShiftAddress, refundAddress, orderId
  )),
  clearSendAmount: () => dispatch(clearSendAmount),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendAmount);
