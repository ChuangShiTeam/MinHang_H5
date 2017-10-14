import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, List, Toast} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "寻匙之旅，解锁党建";

        this.handleLoadKey();
    }

    componentWillUnmount() {

    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'index/fetch',
                    data: {
                        list: data
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.index.scroll_top;

                this.props.dispatch({
                    type: 'index/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }


    handleKey(key_id) {
        this.props.dispatch(routerRedux.push({
            pathname: '/key/' + key_id,
            query: {},
        }));

    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;

        return (
            <div>
                <img src={require('../assets/image/banner.jpg')} style={{width: document.documentElement.clientWidth, height: document.documentElement.clientWidth * 0.48 + 'px'}} alt=""/>
                {
                    this.props.index.list.length > 0 ?
                        <List>
                            {
                                this.props.index.list.map((item) => {
                                    return (
                                        <Item
                                            key={item.key_id}
                                            arrow="horizontal"
                                            thumb={<img src={item.key_image_file.file_path?constant.host + item.key_image_file.file_path:null} style={{width: '200px',  height: '96px'}} alt=""/>}
                                            multipleLine
                                            onClick={this.handleKey.bind(this, item.key_id)}
                                        >
                                            {item.key_name} <Brief>{item.key_description}</Brief>
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
                <WhiteSpace size="lg"/>
                <div style={{height: '100px'}}></div>
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
