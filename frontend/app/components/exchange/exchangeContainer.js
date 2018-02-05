import { connect } from 'react-redux';
import Exchange from './exchange';
import { requestAllCoins, addAlert, getRates, getAllCoinData } from '../../actions';

const mapStateToProps = ({ changelly }) => ({
  changelly: changelly
});

const mapDispatchToProps = dispatch => ({
  requestAllCoins: () => dispatch(requestAllCoins()),
  getAllCoinData: (changellyCoinSet) => dispatch(getAllCoinData(changellyCoinSet)),
  addAlert: (message) => dispatch(addAlert(message)),
  getRates: (orderedCoins) => dispatch(getRates(orderedCoins))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
