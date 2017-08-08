import{ connect } from 'react-redux';
import Home from './home';
import { unauthUser } from '../../actions';

const mapStateToProps = () => ({

});

const mapDispatchToProps = dispatch => ({
  unauthUser: () => dispatch(unauthUser)
});

export default connect(
mapStateToProps,
mapDispatchToProps
)(Home);
