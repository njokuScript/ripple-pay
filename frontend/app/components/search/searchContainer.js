import { connect } from 'react-redux';
import Search from './search';
import {updateFilter} from '../../actions/filterActions';
import {requestUsers} from '../../actions/authActions';

const mapStateToProps = ({user}) => ({
  users: user.users,
  user: user
});

const mapDispatchToProps = dispatch => ({
  requestUsers: (query) => dispatch(requestUsers(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
