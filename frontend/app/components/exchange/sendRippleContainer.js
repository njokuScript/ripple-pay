import { connect } from 'react-redux';
import SendRipple from './sendRipple';
import Config from '../../config_enums';

import { 
  preparePayment, 
  signAndSend, 
  requestTransactions, 
  clearTransaction,
  addAlert,
  sendPaymentWithPersonalAddress 
} from '../../actions';

const mapStateToProps = ({ user, transaction }) => ({
  fromAddress: user.activeWallet === Config.WALLETS.BANK_WALLET ? user.cashRegister : user.personalAddress,
  sourceTag: user.wallets.length > 0 ? user.wallets[user.wallets.length - 1] : undefined,
  activeWallet: user.activeWallet,
  transaction: transaction
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  preparePayment: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    preparePayment(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  signAndSend: (fromAddress, amount) => dispatch(signAndSend(fromAddress, amount)),
  sendPaymentWithPersonalAddress: (fromAddress, secret, amount) => dispatch(sendPaymentWithPersonalAddress(fromAddress, secret, amount)),
  addAlert: (message) => dispatch(addAlert(message)),
  clearTransaction: () => dispatch(clearTransaction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRipple);
