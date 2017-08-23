import { connect } from 'react-redux';
import BankSend from './banksend';
import { sendInBank } from '../../actions/authActions';

const mapStateToProps = ({user}) => ({
  sender_id: user.user_id
});

const mapDispatchToProps = dispatch => ({
  sendInBank: (sender_id, receiver_id, amount) => dispatch(sendInBank(sender_id, receiver_id, amount))
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(BankSend);
