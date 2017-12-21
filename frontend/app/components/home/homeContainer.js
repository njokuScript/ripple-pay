import{ connect } from 'react-redux';
import Home from './home';
import { requestTransactions, requestAddressAndDesTag, unauthUser } from '../../actions/authActions';
import { requestShifts } from '../../actions/shapeActions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  transactions: user.transactions,
  shapeshiftTransactions: user.shapeshiftTransactions,
  user: user
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  requestShifts: () => dispatch(requestShifts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
