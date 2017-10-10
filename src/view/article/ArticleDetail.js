import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace} from 'antd-mobile';

import http from '../../util/http';
import validate from '../../util/validate';

class ArticleDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            article: {},
        };
    }

    componentDidMount() {
        document.body.scrollTop = 0;
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>

                {
                    this.state.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.state.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({}) => ({}))(ArticleDetail);
