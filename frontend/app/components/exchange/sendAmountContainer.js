import { connect } from 'react-redux';
import SendAmount from './sendAmount';
import {
  // requestMarketInfo,
  // sendAmount,
  // shapeshift,
  // makeShapeshiftTransaction,
  clearChangellyTransaction,
  clearTransaction,
  addAlert,
  signAndSend,
  sendPaymentWithPersonalAddress,
  preparePayment,
  preparePaymentWithPersonalAddress
 } from '../../actions';

const mapStateToProps = ({ changelly, transaction, user }) => ({
  changelly,
  transaction,
  user
});

const mapDispatchToProps = dispatch => ({
  addAlert: (message) => dispatch(addAlert(message)),
  clearChangellyTransaction: () => dispatch(clearChangellyTransaction),
  clearTransaction: () => dispatch(clearTransaction()),
  preparePayment: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    preparePayment(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  preparePaymentWithPersonalAddress: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    preparePaymentWithPersonalAddress(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  signAndSend: (fromAddress, amount) => dispatch(signAndSend(fromAddress, amount)),
  sendPaymentWithPersonalAddress: (fromAddress, secret, amount) => dispatch(sendPaymentWithPersonalAddress(fromAddress, secret, amount))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendAmount);
