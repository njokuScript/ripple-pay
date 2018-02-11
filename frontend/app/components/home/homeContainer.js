import{ connect } from 'react-redux';
import Home from './home';

import { 
  requestTransactions, 
  requestAddressAndDesTag, 
  unauthUser, 
  loadNextTransactions, 
  loadNextChangellyTransactions, 
  refreshShouldLoadMoreValues, 
  requestChangellyTransactions,
  getPersonalAddressTransactions,
  clearAlerts,
  addAlert
} from '../../actions';

const mapStateToProps = ({ user }) => ({
  balance: user.balance,
  personalBalance: user.personalBalance,
  transactions: user.transactions,
  personalTransactions: user.personalTransactions,
  changellyTransactions: user.changellyTransactions,
  shouldLoadMoreChangellyTransactions: user.shouldLoadMoreChangellyTransactions,
  shouldLoadMoreTransactions: user.shouldLoadMoreTransactions,
  activeWallet: user.activeWallet
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  loadNextTransactions: (minDate) => dispatch(loadNextTransactions(minDate)),
  loadNextChangellyTransactions: (minDate) => dispatch(loadNextChangellyTransactions(minDate)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  requestChangellyTransactions: () => dispatch(requestChangellyTransactions()),
  refreshShouldLoadMoreValues:() =>  dispatch(refreshShouldLoadMoreValues),
  getPersonalAddressTransactions: (limit) => dispatch(getPersonalAddressTransactions(limit)),
  clearAlerts: () => dispatch(clearAlerts()),
  addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
