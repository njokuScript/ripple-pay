import{ connect } from 'react-redux';
import Home from './home';
import { requestTransactions, requestAddressAndDesTag, unauthUser, loadNextTransactions, loadNextShapeShiftTransactions } from '../../actions/authActions';
import { requestShifts } from '../../actions/shapeActions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  transactions: user.transactions,
  shapeshiftTransactions: user.shapeshiftTransactions
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  loadNextTransactions: (minDate) => dispatch(loadNextTransactions(minDate)),
  loadNextShapeShiftTransactions: (minDate) => dispatch(loadNextShapeShiftTransactions(minDate)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  requestShifts: () => dispatch(requestShifts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
