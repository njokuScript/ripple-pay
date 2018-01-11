import { connect } from 'react-redux';
import BankSend from './banksend';
import { sendInBank } from '../../actions/authActions';
import { addAlert, clearAlerts } from '../../actions/alertsActions';
import { requestTransactions } from '../../actions/authActions';

const mapStateToProps = ({user, alerts}) => ({
  balance: user.balance,
  alerts: alerts
});

const mapDispatchToProps = dispatch => ({
  sendInBank: (receiver_id, amount) => dispatch(sendInBank(receiver_id, amount)),
  addAlert: (msg) => dispatch(addAlert(msg)),
  requestTransactions: (user) => dispatch(requestTransactions(user)),
  clearAlerts: () => dispatch(clearAlerts())
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(BankSend);
