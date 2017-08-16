import{ connect } from 'react-redux';
import Home from './home';
import { unauthUser } from '../../actions';
import { requestTransactions, requestAddressAndDesTag } from '../../actions/authActions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  transactions: user.transactions,
  user: user
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
