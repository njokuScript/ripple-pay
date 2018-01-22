import { connect } from 'react-redux';
import Settings from './settings';
import { unauthUser, changeWallet } from '../../actions';

const mapStateToProps = ({ user }) => ({
  activeWallet: user.activeWallet
});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser()),
  changeWallet: () => dispatch(changeWallet)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
