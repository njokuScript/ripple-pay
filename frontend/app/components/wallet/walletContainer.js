import{ connect } from 'react-redux';
import Wallet from './wallet';
import { requestTransactions } from '../../actions/authActions';


const mapStateToProps = ({user}) => ({
  user: user,
  cashRegister: user.cashRegister,
  destinationTag: user.destinationTag
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
