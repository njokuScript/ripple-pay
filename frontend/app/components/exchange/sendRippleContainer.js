import { connect } from 'react-redux';
import SendRipple from './sendRipple';
import { 
  preparePayment, 
  signAndSend, 
  requestTransactions, 
  clearTransaction,
  addAlert 
} from '../../actions';

const mapStateToProps = ({ user, transaction }) => ({
  fromAddress: user.cashRegister,
  sourceTag: user.wallets.length > 0 ? user.wallets[user.wallets.length - 1] : undefined,
  transaction: transaction
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  preparePayment: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    preparePayment(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  signAndSend: (fromAddress, amount) => dispatch(signAndSend(fromAddress, amount)),
  addAlert: (message) => dispatch(addAlert(message)),
  clearTransaction: () => dispatch(clearTransaction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRipple);
