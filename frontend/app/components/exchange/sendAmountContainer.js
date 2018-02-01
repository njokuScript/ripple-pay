import { connect } from 'react-redux';
import SendAmount from './sendAmount';
import {
  // requestMarketInfo,
  // sendAmount,
  // shapeshift,
  // makeShapeshiftTransaction,
  clearChangellyTransaction,
  createChangellyTransaction,
  addAlert,
  signAndSend
 } from '../../actions';

const mapStateToProps = ({ changelly }) => ({
  changelly: changelly,
});

const mapDispatchToProps = dispatch => ({
  // requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2)),
  addAlert: (message) => dispatch(addAlert(message)),
  // sendAmount: (amount, withdrawal, pair, returnAddress, destTag) => dispatch(sendAmount(amount, withdrawal, pair, returnAddress, destTag)),
  signAndSend: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    signAndSend(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  createChangellyTransaction: (from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag) => dispatch(createChangellyTransaction(from, to, withdrawalAddress, refundAddress, toDestTag, refundDestTag)),
  clearChangellyTransaction: () => dispatch(clearChangellyTransaction)
  // shapeshift: (withdrawal, pair, returnAddress, destTag) => dispatch(shapeshift(withdrawal, pair, returnAddress, destTag)),
  // makeShapeshiftTransaction: (
    // from, to, otherParty, shapeShiftAddress, refundAddress, orderId
  // ) => dispatch(makeShapeshiftTransaction(
    // from, to, otherParty, shapeShiftAddress, refundAddress, orderId
  // )),
  // clearSendAmount: () => dispatch(clearSendAmount),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendAmount);
