import { connect } from 'react-redux';
import Exchange from './exchange'
import { requestAllCoins, requestRate } from '../../actions/shapeActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape
});

const mapDispatchToProps = dispatch => ({
  requestAllCoins: () => dispatch(requestAllCoins()),
  requestRate: (coin) => dispatch(requestRate(coin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
