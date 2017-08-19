import{ connect } from 'react-redux';
import Wallet from './wallet';
import { requestTransactions, requestAllWallets, requestOnlyDesTag, requestAddressAndDesTag, delWallet } from '../../actions/authActions';


const mapStateToProps = ({user}) => ({
  user: user,
  cashRegister: user.cashRegister,
  wallets: user.wallets
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAllWallets: (user_id) => dispatch(requestAllWallets(user_id)),
  requestOnlyDesTag: (user_id) => dispatch(requestOnlyDesTag(user_id)),
  requestAddressAndDesTag: (user_id) => dispatch(requestAddressAndDesTag(user_id)),
  delWallet: (user_id, desTag) => dispatch(delWallet(user_id, desTag))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
