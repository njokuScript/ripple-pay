import { connect } from 'react-redux';
import BankSend from './banksend';
import { 
  sendInBank, 
  addAlert, 
  clearAlerts, 
  requestTransactions,
  preparePersonalToBank,
  sendPaymentWithPersonalAddress ,
  clearTransaction
} from '../../actions';

const mapStateToProps = ({user, transaction, alerts}) => ({
  balance: user.balance,
  personalBalance: user.personalBalance,
  activeWallet: user.activeWallet,
  personalAddress: user.personalAddress,
  transaction: transaction,
  alerts: alerts
});

const mapDispatchToProps = dispatch => ({
  sendInBank: (receiver_id, amount) => dispatch(sendInBank(receiver_id, amount)),
  addAlert: (msg) => dispatch(addAlert(msg)),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  preparePersonalToBank: (amount, fromAddress, toScreenName) => dispatch(preparePersonalToBank(amount, fromAddress, toScreenName)),
  sendPaymentWithPersonalAddress: (fromAddress, secret, amount) => dispatch(sendPaymentWithPersonalAddress(fromAddress, secret, amount)),
  clearTransaction: () => dispatch(clearTransaction()),
  clearAlerts: () => dispatch(clearAlerts())
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(BankSend);
