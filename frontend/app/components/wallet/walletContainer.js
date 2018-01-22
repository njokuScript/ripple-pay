import{ connect } from 'react-redux';
import Wallet from './wallet';
import {
  requestTransactions,
  requestAllWallets,
  requestOldAddress,
  requestOnlyDesTag,
  requestAddress,
  delWallet,
  genPersonalAddress,
  removePersonalAddress
} from '../../actions';


const mapStateToProps = ({user}) => ({
  user: user,
  cashRegister: user.cashRegister,
  wallets: user.wallets,
  personalAddress: user.personalAddress
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: () => dispatch(requestTransactions()),
  requestAllWallets: () => dispatch(requestAllWallets()),
  requestOnlyDesTag: (cashRegister) => dispatch(requestOnlyDesTag(cashRegister)),
  requestAddress: () => dispatch(requestAddress()),
  delWallet: (desTag, cashRegister) => dispatch(delWallet(desTag, cashRegister)),
  requestOldAddress: () => dispatch(requestOldAddress()),
  genPersonalAddress: (setSecret) => dispatch(genPersonalAddress(setSecret)),
  removePersonalAddress: () => dispatch(removePersonalAddress())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
