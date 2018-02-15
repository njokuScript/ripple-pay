import{ connect } from 'react-redux';
import Wallet from './wallet';
import {
  requestTransactions,
  generateDestTag,
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
  generateDestTag: () => dispatch(generateDestTag()),
  requestAddress: () => dispatch(requestAddress()),
  delWallet: (desTag) => dispatch(delWallet(desTag)),
  genPersonalAddress: (setSecret) => dispatch(genPersonalAddress(setSecret)),
  removePersonalAddress: () => dispatch(removePersonalAddress())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
