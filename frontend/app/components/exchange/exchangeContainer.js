import { connect } from 'react-redux';
import Exchange from './exchange'
import { requestAllCoins, requestRate, clearSendAmount } from '../../actions/shapeActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape
});

const mapDispatchToProps = dispatch => ({
  requestAllCoins: () => dispatch(requestAllCoins()),
  requestRate: (coin) => dispatch(requestRate(coin)),
  clearSendAmount: () => dispatch(clearSendAmount)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
