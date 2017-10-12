import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, List, Button} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "激情之匙";

        this.handleLoadKey();

    }

    componentWillUnmount() {

    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/find',
            data: {
                key_id: this.props.key0.key_id
            },
            success: function (data) {
                let step = 0;
                if (data.member_key && data.member_key.key_is_activated) {
                    step = 2;
                }
                this.props.dispatch({
                    type: 'key0/fetch',
                    data: {
                        key: data.key,
                        member_key: data.member_key,
                        step: step
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.key0.scroll_top;

                this.props.dispatch({
                    type: 'key0/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleQRCode() {
        window.wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode"],
            success: function (response) {
                console.log(response.resultStr);
                let result = JSON.parse(response.resultStr);
                if (result && result.task_id) {
                    this.props.dispatch({
                        type: 'key0/fetch',
                        data: {
                            task_id: result.task_id,
                            secene_id: result.secene_id,
                            action: result.action
                        }
                    });
                    this.handleLoadTask();
                }
                console.log(response);
            }
        });
    }

    handleLoadTask() {
        this.props.dispatch({
            type: 'key0/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/find',
            data: {},
            success: function (data) {
                let step = 1;
                if (data.member_task) {
                    step = 2
                }
                this.props.dispatch({
                    type: 'key0/fetch',
                    data: {
                        task: data.task,
                        member_task: data.member_task?data.member_task:null,
                        step: step
                    }
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key0/fetch',
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
                <WingBlank mode={20}>
                    <Steps current={this.props.key0.step } direction="horizontal">
                        <Step title="第一步" description="" />
                        <Step title="第二步" description="" />
                        <Step title="第三步" description="" />
                    </Steps>
                    {
                        this.props.key0.step == 0 ?
                            <div>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <Button onClick={this.handleQRCode.bind(this)}>扫二维码</Button>
                            </div>
                            :
                            ''
                    }
                    {
                        this.props.key0.step == 1 ?
                            <div>
                                {
                                    this.props.key0.task?
                                    <div>
                                        {
                                            this.props.key0.task.task_type === 'QUESTION' ?
                                                this.props.key0.task.question_list.map((question, index) => {
                                                    if (question.question_type === 'RADIO') {
                                                        return '单选题';
                                                    } else if (question.question_type === 'check') {
                                                        return '复选题';
                                                    } else if (question.question_type === 'GAP_FILLING') {
                                                        return '填空题';
                                                    }
                                                    return null;
                                                })
                                                :
                                            this.props.key0.task.task_type === 'PICTURE' ? '上传图片'
                                                :
                                            this.props.key0.task.task_type === 'RECORD' ? '上传录音'
                                                : null
                                        }
                                    </div>
                                    :
                                    ''
                                }
                            </div>
                            :
                            ''
                    }
                    {
                        this.props.key0.step == 2 ?
                            <div>
                                恭喜你完成任务获得激情钥匙一枚
                            </div>
                            :
                            ''
                    }
                </WingBlank>
                {
                    this.props.key0.is_load && this.props.key0.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.key0.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.key0.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({key0}) => ({key0}))(Index);
