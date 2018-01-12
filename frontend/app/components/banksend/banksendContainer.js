import { connect } from 'react-redux';
import BankSend from './banksend';
import { 
  sendInBank, 
  addAlert, 
  clearAlerts, 
  requestTransactions 
} from '../../actions';

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
