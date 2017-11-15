import { connect } from 'react-redux';
import BankSend from './banksend';
import { sendInBank } from '../../actions/authActions';
import { addAlert } from '../../actions/alertsActions';
import { requestTransactions } from '../../actions/authActions';

const mapStateToProps = ({user}) => ({
  balance: user.balance,
});

const mapDispatchToProps = dispatch => ({
  sendInBank: (receiver_id, amount) => dispatch(sendInBank(receiver_id, amount)),
  addAlert: (msg) => dispatch(addAlert(msg)),
  requestTransactions: (user) => dispatch(requestTransactions(user)),

});

export default connect(
  mapStateToProps, mapDispatchToProps
)(BankSend);
