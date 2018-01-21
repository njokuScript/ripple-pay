import { connect } from 'react-redux';
import PersonalWallet from './personalWallet';
import {
    genPersonalAddress,
    removePersonalAddress
} from '../../actions';


const mapStateToProps = ({ user }) => ({
    personalAddress: user.personalAddress
});

const mapDispatchToProps = dispatch => ({
    genPersonalAddress: (setSecret) => dispatch(genPersonalAddress(setSecret)),
    removePersonalAddress: () => dispatch(removePersonalAddress())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonalWallet);