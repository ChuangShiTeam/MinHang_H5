import React, {Component} from 'react';
import {connect} from 'dva';
import {createForm} from "rc-form";
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, Button, List, TextareaItem, Result, Icon, Toast} from 'antd-mobile';

import http from '../../util/http';
import notification from '../../util/notification';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "智慧之钥";

        this.handleLoadKey();

    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                description: '智慧之钥',
                key_id: '0fef53b2ce614711a9235e05ccbd5dbc',
                is_load: false,
                key: {},
                member_key: {},
                selectedIndex: 0,
                step1: 0,
                step2: 0,
                task_id: '',
                task: null,
                member_task_list: [],
                key_is_activated: false,
                is_record: false,
                file: null,
                secene_id: '',
                action: '',
                scroll_top: 0
            }
        });
    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/find',
            data: {
                key_id: this.props.key5.key_id
            },
            success: function (data) {
                let key_is_activated = false;
                if (data.member_key && data.member_key.key_is_activated) {
                    key_is_activated = true;
                }
                let member_task_list = [];
                let step1 = 0;
                let step2 = 0;
                if (data.member_task_list && data.member_task_list.length > 0) {
                    for (let member_task of data.member_task_list) {
                        if (member_task.key_activated_step === 0) {
                            step1 = 2;
                        } else if (member_task.key_activated_step === 1) {
                            step2 = 2;
                        }
                    }
                    member_task_list = data.member_task_list;
                }
                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        key: data.key,
                        member_key: data.member_key,
                        member_task_list: member_task_list,
                        step1: step1,
                        step2: step2,
                        key_is_activated: key_is_activated
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.key5.scroll_top;

                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleQRCode() {
        let that = this;
        window.wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode"],
            success: function (response) {
                let result = '';
                try {
                    result = JSON.parse(response.resultStr);
                } catch (e) {
                    Toast.fail('请扫描正确二维码', 2);
                }

                if (result && result.task_id) {
                    http.request({
                        url: '/mobile/minhang/task/check',
                        data: {
                            task_id: result.task_id,
                            action: 'loadVideoTask'
                        },
                        success: function (data) {
                            if (data) {
                                Toast.fail(data, 2);
                            } else {
                                that.props.dispatch({
                                    type: 'key5/fetch',
                                    data: {
                                        task_id: result.task_id,
                                        secene_id: result.secene_id,
                                        action: result.action
                                    }
                                });
                                that.handleLoadTask(result.task_id);
                            }
                        },
                        complete: function () {

                        }
                    });

                } else {
                    Toast.fail('请扫描正确二维码', 2);
                }
            }
        });
    }

    handleLoadTask(task_id) {
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/find',
            data: {
                task_id: task_id
            },
            success: function (data) {
                let step1 = this.props.key5.step1;
                let step2 = this.props.key5.step2;
                if (this.props.key5.selectedIndex === 0) {
                    step1 = 1;
                } else if (this.props.key5.selectedIndex === 1) {
                    step2 = 1;
                }
                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        task: data.task,
                        step1: step1,
                        step2: step2
                    }
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitQuestionTask() {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let question_list = this.props.key5.task.question_list;
                let member_question_list = [];
                for (let i = 0; i < question_list.length; i++) {
                    member_question_list.push({
                        question_id: question_list[i].question_id,
                        member_answer: values['question_answer_' + i]
                    })
                }
                values.member_question_list = member_question_list;
                values.task_id = this.props.key5.task.task_id;
                values.key_activated_step = this.props.key5.selectedIndex;
                values.member_task_type = 'VIDEO_QUESTION';
                http.request({
                    url: '/mobile/minhang/task/member/complete',
                    data: values,
                    success: function (data) {
                        this.handelSubmitResponse();
                    }.bind(this),
                    complete() {

                    }
                });
            }
        });
    }

    handelSubmitResponse() {
        let step1 = this.props.key5.step1;
        let step2 = this.props.key5.step2;
        let selectedIndex = this.props.key5.selectedIndex;
        if (this.props.key5.selectedIndex === 0) {
            step1 = 2;
            selectedIndex = 1;
        } else if (this.props.key5.selectedIndex === 1) {
            step2 = 2;
            selectedIndex = 0;
        }
        let member_key = this.props.key5.member_key;
        let key_is_activated = false;
        member_key.task_complete_quantity = member_key.task_complete_quantity + 1;
        if (member_key.task_complete_quantity === member_key.task_quantity) {
            member_key.key_is_activated = true;
            key_is_activated = true;
        }
        notification.emit('sendMessage', {
            targetId: '5',
            action: 'loadVideoTask',
            content: ''
        });
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                step1: step1,
                step2: step2,
                selectedIndex: selectedIndex,
                member_key: member_key,
                key_is_activated: key_is_activated
            }
        });

    }

    handleSegmentedControl(event) {
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                selectedIndex: event.nativeEvent.selectedSegmentIndex
            }
        });
        this.handleLoadKey();
    }

    handleCreateHistory() {
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/member/history/create',
            data: {},
            success: function (data) {
                Toast.info('生成纪念册成功', 1)

            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleItineraryRestart() {
        this.props.dispatch({
            type: 'key5/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/member/itinerary/restart',
            data: {},
            success: function (data) {
                Toast.info('重启寻钥之旅成功', 3);
                setTimeout(function () {
                    this.props.dispatch(routerRedux.push({
                        pathname: '/index',
                        query: {},
                    }));
                }.bind(this), 3000);
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key5/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    render() {
        const Step = Steps.Step;
        const {getFieldProps, getFieldError} = this.props.form;

        return (
            <div>
                <WhiteSpace size="lg"/>
                <WingBlank mode={20}>
                    {
                        this.props.key5.key_is_activated === true ?
                            <div>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WhiteSpace size="xl"/>
                                <WingBlank size="md">
                                    <div className="upload-image">
                                        <img src={require('../../assets/image/key5_light.png')} alt=""/>
                                        <WhiteSpace size="xl"/>
                                        <div className="upload-image-tip">
                                            恭喜你完成任务获得智慧钥匙一枚
                                        </div>
                                    </div>
                                </WingBlank>
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleCreateHistory.bind(this)}>生成纪念册</Button>
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleItineraryRestart.bind(this)}>重启寻钥之旅</Button>
                            </div>
                            :
                            <div>
                                <SegmentedControl style={{height: '0.8rem'}} selectedIndex={this.props.key5.selectedIndex} values={['回答视频问题一', '回答视频问题二']} onChange={this.handleSegmentedControl.bind(this)}/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                {
                                    this.props.key5.selectedIndex === 0?
                                        <div>
                                            <Steps current={this.props.key5.step1} direction="horizontal">
                                                <Step title="扫二维码" description=""/>
                                                <Step title="回答问题" description=""/>
                                                <Step title="完成任务" description=""/>
                                            </Steps>
                                            {
                                                this.props.key5.step1 === 0 ?
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
                                                        <Button onClick={this.handleQRCode.bind(this)}>扫描智慧之钥二维码</Button>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            {
                                                this.props.key5.step1 === 1 ?
                                                    <div>
                                                        {
                                                            this.props.key5.task?
                                                                <div>
                                                                    {
                                                                        this.props.key5.task.question_list.map((question, index) => {
                                                                            return (
                                                                                <div>
                                                                                    <WhiteSpace size="lg"/>
                                                                                    <WhiteSpace size="lg"/>
                                                                                    <List renderHeader={() => question.question_title}>
                                                                                        <TextareaItem
                                                                                            {...getFieldProps(`question_answer_${index}`, {
                                                                                                rules: [{
                                                                                                    required: true,
                                                                                                    message: '请填写答案'
                                                                                                }],
                                                                                                initialValue: ''
                                                                                            })}
                                                                                            error={!!getFieldError(`question_answer_${index}`)}
                                                                                            clear
                                                                                            title="答案"
                                                                                            rows={5}
                                                                                            autoHeight
                                                                                            placeholder="请填写答案"
                                                                                        />
                                                                                    </List>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                    <WhiteSpace size="lg"/>
                                                                    <WhiteSpace size="lg"/>
                                                                    <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                </div>
                                                                :
                                                                ''
                                                        }
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            {
                                                this.props.key5.step1 === 2 ?
                                                    <div>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <WhiteSpace size="xl"/>
                                                        <Result
                                                            img={<Icon type="check-circle" className="icon" style={{ fill: '#d3414c' }} />}
                                                            title="任务已完成"
                                                            message={`当前钥匙任务完成(${this.props.key5.member_key.task_complete_quantity?this.props.key5.member_key.task_complete_quantity:0}/2)`}
                                                        />
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        this.props.key5.selectedIndex === 1?
                                            <div>
                                                <Steps current={this.props.key5.step2} direction="horizontal">
                                                    <Step title="扫二维码" description="" />
                                                    <Step title="回答问题" description="" />
                                                    <Step title="完成任务" description="" />
                                                </Steps>
                                                {
                                                    this.props.key5.step2 === 0 ?
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
                                                            <Button onClick={this.handleQRCode.bind(this)}>扫描智慧之钥二维码</Button>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.props.key5.step2 === 1 ?
                                                        <div>
                                                            {
                                                                this.props.key5.task?
                                                                    <div>
                                                                        {
                                                                            this.props.key5.task.question_list.map((question, index) => {
                                                                                return (
                                                                                    <div>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <List renderHeader={() => question.question_title}>
                                                                                            <TextareaItem
                                                                                                {...getFieldProps(`question_answer_${index}`, {
                                                                                                    rules: [{
                                                                                                        required: true,
                                                                                                        message: '请填写答案'
                                                                                                    }],
                                                                                                    initialValue: ''
                                                                                                })}
                                                                                                error={!!getFieldError(`question_answer_${index}`)}
                                                                                                clear
                                                                                                title="答案"
                                                                                                rows={5}
                                                                                                autoHeight
                                                                                                placeholder="请填写答案"
                                                                                            />
                                                                                        </List>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        }
                                                                        <WhiteSpace size="lg"/>
                                                                        <WhiteSpace size="lg"/>
                                                                        <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            }
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.props.key5.step2 === 2 ?
                                                        <div>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <WhiteSpace size="xl"/>
                                                            <Result
                                                                img={<Icon type="check-circle" className="icon" style={{ fill: '#d3414c' }} />}
                                                                title="任务已完成"
                                                                message={`当前钥匙任务完成(${this.props.key5.member_key.task_complete_quantity?this.props.key5.member_key.task_complete_quantity:0}/2)`}
                                                            />
                                                        </div>
                                                        :
                                                        ''
                                                }
                                            </div>
                                            :
                                            null
                                }
                            </div>
                    }
                </WingBlank>
                {
                    this.props.key5.is_load && this.props.key5.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.key5.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.key5.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}
Index = createForm()(Index);
export default connect(({key5}) => ({key5}))(Index);
