import { connect } from 'react-redux';
import Send from './send';
import { signAndSend, requestTransactions, requestAddressAndDesTag } from '../../actions/authActions';
import { addAlert } from '../../actions/alertsActions'

const mapStateToProps = ({user}) => ({
  fromAddress: user.cashRegister,
  sourceTag: user.destinationTag
});

const mapDispatchToProps = dispatch => ({
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  requestAddressAndDesTag: (user) => dispatch(requestAddressAndDesTag(user)),
  signAndSend: (amount, fromAddress, toAddress, sourceTag, toDesTag) => dispatch(
    signAndSend(amount, fromAddress, toAddress, sourceTag, toDesTag)
  ),
  addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send);
