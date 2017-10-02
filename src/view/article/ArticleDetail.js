import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import http from '../../util/http';
import validate from '../../util/validate';

class ArticleDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

            </div>
        );
    }
}

export default connect(({}) => ({}))(ArticleDetail);
