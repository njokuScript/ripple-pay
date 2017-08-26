import { connect } from 'react-redux';
import SendRipple from './sendRipple';
import { signAndSend, requestTransactions } from '../../actions/authActions';
import { addAlert } from '../../actions/alertsActions';

const mapStateToProps = ({ user }) => ({
  fromAddress: user.cashRegister,
  sourceTag: user.wallets.length > 0 ? user.wallets[user.wallets.length - 1] : undefined,
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  signAndSend: (amount, fromAddress, toAddress, sourceTag, toDesTag, userId) => dispatch(
    signAndSend(amount, fromAddress, toAddress, sourceTag, toDesTag, userId)
  ),
  addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRipple);
