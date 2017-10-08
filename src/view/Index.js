import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, List} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
    }

    componentDidMount() {
        document.title = "寻匙之旅，解锁党建";

        document.body.scrollTop = this.props.index.scroll_top;

        this.props.dispatch({
            type: 'index/fetch',
            data: {
                is_load: true
            }
        });
    }

    componentWillUnmount() {

    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;

        return (
            <div>
                {
                    this.props.index.list.length > 0 ?
                        <List>
                            {
                                this.props.index.list.map((item) => {
                                    return (
                                        <Item
                                            arrow="horizontal"
                                            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                            multipleLine
                                            onClick={() => {}}
                                        >
                                            Title <Brief>subtitle</Brief>
                                        </Item>
                                    );
                                })
                            }
                        </List>
                        :
                        ''
                }
                {
                    this.props.index.is_load && this.props.index.length === 0 ?
                        <div>
                            <img src={require('../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.index.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.index.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({index}) => ({index}))(Index);
