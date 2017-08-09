import{ connect } from 'react-redux';
import Home from './home';
import { unauthUser } from '../../actions';
import { requestTransactions } from '../../actions/authActions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  transactions: user.transactions,
  user: user
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser),
  requestTransactions: (user) => dispatch(requestTransactions(user))
});

export default connect(
mapStateToProps,
mapDispatchToProps
)(Home);
