import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        window.socket.on('event', function (data) {

        });
    }

    componentWillUnmount() {
        window.socket.removeAllListeners(['event']);
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

Login.propTypes = {};

export default connect(() => ({}))(Login);
