import React, {Component} from 'react';
import {connect} from 'dva';
import {
    ActivityIndicator,
    WhiteSpace,
    WingBlank,
    SegmentedControl,
    Steps,
    List,
    Button,
    Radio,
    Toast
} from 'antd-mobile';
import Picture from '../Picture';

import http from '../../util/http';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        document.title = "我的纪念册";

        this.handleLoadHistory();
    }

    componentWillUnmount() {
    }

    handleLoadHistory() {
        http.request({
            url: '/mobile/minhang/member/history/find',
            data: {
                member_history_id: this.props.params.history_id
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'history/fetch',
                    data: {
                        member_task_list: data
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.history.scroll_top;

                this.props.dispatch({
                    type: 'history/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    render() {
        const Item = List.Item;
        const Step = Steps.Step;

        return (
            <div>
                <WhiteSpace size="lg"/>
                <WingBlank mode={20}></WingBlank>
                {
                    this.props.history.is_load && this.props.history.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.history.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.history.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({history}) => ({history}))(Index);
