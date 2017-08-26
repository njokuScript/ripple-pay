import { connect } from 'react-redux';
import Transition from './transition';
import { requestMarketInfo } from '../../actions/shapeActions';

const mapStateToProps = ({ shape }) => ({
  shape: shape
});

const mapDispatchToProps = dispatch => ({
  requestMarketInfo: (coin1, coin2) => dispatch(requestMarketInfo(coin1, coin2))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition);
