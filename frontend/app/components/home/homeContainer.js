import{ connect } from 'react-redux';
import Home from './home';

import { 
  requestTransactions, 
  requestAddressAndDesTag, 
  unauthUser, 
  loadNextTransactions, 
  loadNextShapeShiftTransactions, 
  refreshShouldLoadMoreValues, 
  requestShifts 
} from '../../actions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  transactions: user.transactions,
  shapeshiftTransactions: user.shapeshiftTransactions,
  shouldLoadMoreShapeShiftTransactions: user.shouldLoadMoreShapeShiftTransactions,
  shouldLoadMoreTransactions: user.shouldLoadMoreTransactions
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  loadNextTransactions: (minDate) => dispatch(loadNextTransactions(minDate)),
  loadNextShapeShiftTransactions: (minDate) => dispatch(loadNextShapeShiftTransactions(minDate)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  requestShifts: () => dispatch(requestShifts()),
  refreshShouldLoadMoreValues:() =>  dispatch(refreshShouldLoadMoreValues)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
