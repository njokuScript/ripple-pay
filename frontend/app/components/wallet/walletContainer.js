import{ connect } from 'react-redux';
import Wallet from './wallet';
import {
  requestTransactions,
  requestAllWallets,
  requestOldAddress,
  requestOnlyDesTag,
  requestAddress,
  delWallet,
  removeCashRegister,
} from '../../actions/authActions';


const mapStateToProps = ({user}) => ({
  user: user,
  cashRegister: user.cashRegister,
  wallets: user.wallets
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAllWallets: (user_id) => dispatch(requestAllWallets(user_id)),
  requestOnlyDesTag: (user_id, cashRegister) => dispatch(requestOnlyDesTag(user_id, cashRegister)),
  requestAddress: (user_id) => dispatch(requestAddress(user_id)),
  delWallet: (user_id, desTag, cashRegister) => dispatch(delWallet(user_id, desTag, cashRegister)),
  requestOldAddress: (user_id) => dispatch(requestOldAddress(user_id)),
  removeCashRegister: (userId) => dispatch(removeCashRegister(userId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
