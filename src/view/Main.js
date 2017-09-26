import React, {Component} from 'react';
import {connect} from 'dva';
import io from 'socket.io-client';

window.socket = io('http://121.40.44.121:2999');

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

Main.propTypes = {};

export default connect(() => ({}))(Main);
