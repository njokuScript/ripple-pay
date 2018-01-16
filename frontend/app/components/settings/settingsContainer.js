import { connect } from 'react-redux';
import Settings from './settings';
import { unauthUser } from '../../actions';

const mapStateToProps = ({ user }) => ({

});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
