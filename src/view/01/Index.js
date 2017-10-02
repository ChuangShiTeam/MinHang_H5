import React, {Component } from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

class Index extends Component {
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
            <div className="index-01-bg">
                <div className="con_but">
                    <buttom className="con_but_01">
                        <img src={require('../../image/index_01_but01.png')} />
                    </buttom>
                    <buttom className="con_but_02">
                        <img src={require('../../image/index_01_but02.png')} />
                    </buttom>
                </div>
            </div>
        );
    }
}

Index.propTypes = {};

export default connect(() => ({}))(Index);
