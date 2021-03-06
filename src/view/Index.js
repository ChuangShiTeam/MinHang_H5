import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, List, Toast} from 'antd-mobile';

import constant from '../util/constant';
import http from '../util/http';
import notification from '../util/notification';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_show_sign_success: false
        }
    }

    componentDidMount() {
        document.title = "寻钥之旅，解锁党建";

        this.handleLoadKey();
    }

    componentWillUnmount() {

    }

    handleMemberSign() {
        http.request({
            url: '/mobile/minhang/member/sign',
            data: {},
            success: function (data) {
                notification.emit('sendMessage', {
                    targetId: '0',
                    action: 'loadMember',
                    content: ''
                });
                this.setState({
                    is_show_sign_success: true
                }, function() {
                    setTimeout(function() {
                        this.setState({
                            is_show_sign_success: false
                        });
                    }.bind(this), 2000)
                }.bind(this));
            }.bind(this),
            complete: function () {
            }.bind(this)
        });
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
        if(key_id === '8325261b28e84ae2b454c34274168bda') {
            Toast.info('功能开发中，敬请期待......', 2);
        } else {
            this.props.dispatch(routerRedux.push({
                pathname: '/key/' + key_id,
                query: {},
            }));
        }


    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;

        return (
            <div>
                {
                    this.state.is_show_sign_success ?
                    <div style={{zIndex: 10, position:'fixed'}}>
                        <img src={require('../assets/image/sign.png')} style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}} alt=""/>
                    </div>
                    :
                    null
                }
                <div style={{zIndex: 9, position: 'fixed', top: document.documentElement.clientWidth * 0.38 + 'px', right: document.documentElement.clientWidth* 0.01 + 'px'}} onClick={this.handleMemberSign.bind(this)}>
                    <img src={require('../assets/image/icon.png')} style={{width: document.documentElement.clientWidth * 0.2 + 'px', height: document.documentElement.clientWidth * 0.1 + 'px'}} alt="签到"/>
                </div>
                <img src={require('../assets/image/banner.jpg')} style={{width: document.documentElement.clientWidth, height: document.documentElement.clientWidth * 0.48 + 'px'}} alt=""/>
                {
                    this.props.index.list.length > 0 ?
                        <div>
                            <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientWidth * 0.2 + 'px'}}>
                                {
                                    this.props.index.list.map((item, index) => {
                                        return (
                                            <span key={index}>
                                                <a href="javascript:;" onClick={this.handleKey.bind(this, item.key_id)}>
                                                    <img
                                                         style={{width: document.documentElement.clientWidth * 0.12 + 'px', marginTop: document.documentElement.clientWidth * 0.01 + 'px', marginLeft: document.documentElement.clientWidth * 0.04 + 'px'}}
                                                         src={item.member_key.key_is_activated?require(`../assets/image/key${index}_light.png`):require(`../assets/image/key${index}_ashy.png`)}
                                                         alt=""
                                                    />
                                                </a>
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            <List>
                                {
                                    this.props.index.list.map((item) => {
                                        return (
                                            <Item
                                                style={{backgroundColor: '#EFEFEF'}}
                                                key={item.key_id}
                                                extra={<img
                                                        style={{width: document.documentElement.clientWidth * 0.12 + 'px', height: document.documentElement.clientWidth * 0.12 + 'px'}}
                                                        src={item.member_key.key_is_activated?require('../assets/image/percentage100.png'):item.member_key.task_complete_quantity/item.member_key.task_quantity === 1/3? require('../assets/image/percentage30.png'):item.member_key.task_complete_quantity/item.member_key.task_quantity === 1/2? require('../assets/image/percentage50.png'):require('../assets/image/percentage0.png')}
                                                        alt=""
                                                        />}
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
                        </div>
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
