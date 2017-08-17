import{ connect } from 'react-redux';
import Wallet from './wallet';
import { requestTransactions, requestAddressAndDesTag } from '../../actions/authActions';


const mapStateToProps = ({user}) => ({
  user: user,
  cashRegister: user.cashRegister,
  destinationTag: user.destinationTag
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
