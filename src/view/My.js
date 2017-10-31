import React, {Component} from "react";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import {ActivityIndicator, WhiteSpace, List} from 'antd-mobile';
import http from "../util/http";

class My extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        document.title = '个人中心';

        document.body.scrollTop = 0;

        this.handleLoad();
    }

    componentWillUnmount() {

    }

    handleLoad() {
        http.request({
            url: '/mobile/minhang/member/find',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'my/fetch',
                    data: data
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'my/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleHistory(member_history_id) {
        this.props.dispatch(routerRedux.push({
            pathname: '/history/index/' + member_history_id,
            query: {}
        }));
    }

    render() {
        const Item = List.Item;
        return (
            <div>
                <List>
                    <Item
                        thumb={<img src={this.props.my.user_avatar} style={{width: '100px',  height: '100px'}} alt=""/>}
                        multipleLine
                        onClick={() => {}}
                    >
                        {this.props.my.user_name}
                    </Item>
                </List>

                <WhiteSpace size="lg"/>
                <List>
                    <Item
                        thumb={require('../assets/image/book.png')}
                    >
                        我的纪念册
                    </Item>
                    {
                        this.props.my.history_list.map((history, index) =>
                            <Item
                                key={index}
                                thumb={require('../assets/image/book.png')}
                                arrow="horizontal"
                                onClick={this.handleHistory.bind(this, history.member_history_id)}
                            >
                                {history.member_history_name}
                            </Item>
                        )
                    }

                </List>
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
