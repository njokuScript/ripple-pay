import { connect } from 'react-redux';
import Send from './send';
import { requestTransactions, requestAddressAndDesTag } from '../../actions/authActions';


const mapStateToProps = ({user}) => ({
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send);
