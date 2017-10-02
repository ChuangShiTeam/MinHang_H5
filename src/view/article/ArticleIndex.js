import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {ActivityIndicator, WhiteSpace} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http';

class ArticleIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        document.title = '党建';

        document.body.scrollTop = 0;

        this.props.dispatch({
            type: 'article/fetch',
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
                    this.props.article.is_load && this.props.article.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.article.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.article.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({article}) => ({article}))(ArticleIndex);
