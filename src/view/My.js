import React, {Component} from "react";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import {ActivityIndicator, WhiteSpace} from 'antd-mobile';
import http from "../util/http";
import storage from "../util/storage";

class My extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: this.props.my.is_load
        }
    }

    componentDidMount() {
        document.title = '个人中心';

        document.body.scrollTop = 0;

        this.props.dispatch({
            type: 'my/fetch',
            data: {
                is_load: true
            }
        });
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <WhiteSpace size="lg"/>
                {
                    this.props.my.is_load && this.props.my.length === 0 ?
                        <div>
                            <img src={require('../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.my.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.my.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({my}) => ({my}))(My);
