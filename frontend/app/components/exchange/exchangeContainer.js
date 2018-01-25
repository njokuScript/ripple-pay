import { connect } from 'react-redux';
import Exchange from './exchange';
import { requestAllCoins, requestRate, addAlert } from '../../actions';

const mapStateToProps = ({ shape }) => ({
  shape: shape
});

const mapDispatchToProps = dispatch => ({
  requestAllCoins: () => dispatch(requestAllCoins()),
  requestRate: (coin) => dispatch(requestRate(coin)),
  addAlert: (message) => dispatch(addAlert(message)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
