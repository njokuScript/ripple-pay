import{ connect } from 'react-redux';
import Home from './home';

import { 
  requestTransactions, 
  requestAddressAndDesTag, 
  unauthUser, 
  loadNextTransactions, 
  loadNextShapeShiftTransactions, 
  refreshShouldLoadMoreValues, 
  requestShifts,
  getPersonalAddressTransactions,
  clearAlerts
} from '../../actions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  personalBalance: user.personalBalance,
  transactions: user.transactions,
  personalTransactions: user.personalTransactions,
  shapeshiftTransactions: user.shapeshiftTransactions,
  shouldLoadMoreShapeShiftTransactions: user.shouldLoadMoreShapeShiftTransactions,
  shouldLoadMoreTransactions: user.shouldLoadMoreTransactions,
  activeWallet: user.activeWallet
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  loadNextTransactions: (minDate) => dispatch(loadNextTransactions(minDate)),
  loadNextShapeShiftTransactions: (minDate) => dispatch(loadNextShapeShiftTransactions(minDate)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  requestShifts: () => dispatch(requestShifts()),
  refreshShouldLoadMoreValues:() =>  dispatch(refreshShouldLoadMoreValues),
  getPersonalAddressTransactions: (limit) => dispatch(getPersonalAddressTransactions(limit)),
  clearAlerts: () => dispatch(clearAlerts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
