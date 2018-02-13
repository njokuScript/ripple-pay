import { connect } from 'react-redux';
import Search from './search';
import { requestUsers, addAlert } from '../../actions';

const mapStateToProps = ({user}) => ({
  users: user.users,
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestUsers: (query) => dispatch(requestUsers(query)),
  addAlert: (message) => dispatch(addAlert(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
