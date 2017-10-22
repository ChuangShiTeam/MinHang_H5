import React, {Component} from 'react';
import {connect} from 'dva';
import {createForm} from "rc-form";
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, List, Button, InputItem, TextareaItem, Radio, Result, Icon, Toast} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http'
import notification from '../../util/notification';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "力量之钥";

        this.handleLoadKey();

    }

    componentWillUnmount() {

    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/find',
            data: {
                key_id: this.props.key4.key_id
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
                    type: 'key4/fetch',
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
                document.body.scrollTop = this.props.key4.scroll_top;

                this.props.dispatch({
                    type: 'key4/fetch',
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
                            action: 'loadTimelineEvent'
                        },
                        success: function (data) {
                            if (data) {
                                Toast.fail(data, 2);
                            } else {
                                that.props.dispatch({
                                    type: 'key4/fetch',
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
            type: 'key4/fetch',
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
                let step1 = this.props.key4.step1;
                let step2 = this.props.key4.step2;
                if (this.props.key4.selectedIndex === 0) {
                    step1 = 1;
                } else if (this.props.key4.selectedIndex === 1) {
                    step2 = 1;
                }
                this.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        task: data.task,
                        step1: step1,
                        step2: step2,
                    }
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key4/fetch',
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
                let question_list = this.props.key4.task.question_list;
                let member_question_list = [];
                for (let i = 0; i < question_list.length; i++) {
                    member_question_list.push({
                        question_id: question_list[i].question_id,
                        member_answer: values['question_answer_' + i]
                    })
                }
                values.member_question_list = member_question_list;
                values.task_id = this.props.key4.task.task_id;
                values.key_activated_step = this.props.key4.selectedIndex;
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

    handleUploadRecord() {
        window.wx.startRecord();
        this.props.dispatch({
            type: 'key4/fetch',
            data: {
                is_record: true
            }
        });
        let that = this;
        window.wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function (res) {
                var localId = res.localId;
                window.wx.uploadVoice({
                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回音频的服务器端ID
                        that.handleDownLoadWecatVoice(serverId);
                    }
                });
                that.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_record: false
                    }
                });
            }
        });
    }
    handleStopRecord() {
        let that = this;
        window.wx.stopRecord({
            success: function (res) {
                var localId = res.localId;
                window.wx.uploadVoice({
                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回音频的服务器端ID
                        that.handleDownLoadWecatVoice(serverId);
                    }
                });
                that.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_record: false
                    }
                });
            }
        });
    }

    handleDownLoadWecatVoice(media_id) {
        this.props.dispatch({
            type: 'key4/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/wechat/download/media',
            data: {
                media_id: media_id
            },
            success: function (data) {
                if (data.file_id) {
                    this.handleSubmitRecordTask(data.file_id);
                }
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitRecordTask(file_id) {
        this.props.dispatch({
            type: 'key4/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/member/complete',
            data: {
                task_id: this.props.key4.task_id,
                member_record: {
                    record_file: file_id
                },
                key_activated_step: this.props.key4.selectedIndex
            },
            success: function (data) {
                this.handelSubmitResponse();
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleUploadImage() {
        let that = this;
        window.wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                if (localIds && localIds.length === 1) {
                    window.wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            that.handleDownLoadWecatImage(serverId);  //后台下载图片
                        }
                    });
                }
            }
        });
    }

    handleDownLoadWecatImage(media_id) {
        this.props.dispatch({
            type: 'key4/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/wechat/download/media',
            data: {
                media_id: media_id
            },
            success: function (data) {
                if (data.file_id) {
                    this.handleSubmitImageTask(data.file_id);
                }
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitImageTask(file_id) {
        this.props.dispatch({
            type: 'key4/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/member/complete',
            data: {
                task_id: this.props.key4.task_id,
                member_picture: {
                    picture_file: file_id
                },
                key_activated_step: this.props.key4.selectedIndex
            },
            success: function (data) {
                this.handelSubmitResponse();
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key4/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handelSubmitResponse() {
        let step1 = this.props.key4.step1;
        let step2 = this.props.key4.step2;
        let selectedIndex = this.props.key4.selectedIndex;
        if (selectedIndex === 0) {
            step1 = 2;
            selectedIndex = 1;
        } else if (selectedIndex === 1) {
            step2 = 2;
            selectedIndex = 0;
        }
        let member_key = this.props.key4.member_key;
        let key_is_activated = false;
        member_key.task_complete_quantity = member_key.task_complete_quantity + 1;
        if (member_key.task_complete_quantity === member_key.task_quantity) {
            member_key.key_is_activated = true;
            key_is_activated = true;
        }
        notification.emit('sendMessage', {
            targetId: '4',
            action: 'loadTimelineEvent',
            content: ''
        });
        this.props.dispatch({
            type: 'key4/fetch',
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
            type: 'key4/fetch',
            data: {
                selectedIndex: event.nativeEvent.selectedSegmentIndex
            }
        });
    }

    handleCreateHistory() {
        this.props.dispatch({
            type: 'key0/fetch',
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
                    type: 'key0/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleItineraryRestart() {
        this.props.dispatch({
            type: 'key0/fetch',
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
        const {getFieldProps, getFieldError} = this.props.form;

        const RadioItem = Radio.RadioItem;
        return (
            <div>
                <WhiteSpace size="lg"/>
                <WingBlank mode={20}>
                    {
                        this.props.key4.key_is_activated === true ?
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
                                        <img src={require('../../assets/image/key4.png')} alt=""/>
                                        <WhiteSpace size="xl"/>
                                        <div className="upload-image-tip">
                                            恭喜你完成任务获得力量钥匙一枚
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
                                <SegmentedControl style={{height: '0.8rem'}} selectedIndex={this.props.key4.selectedIndex} values={['回答历史问题一', '回答历史问题二']} onChange={this.handleSegmentedControl.bind(this)}/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                {
                                    this.props.key4.selectedIndex === 0?
                                        <div>
                                            <Steps current={this.props.key4.step1} direction="horizontal">
                                                <Step title="扫二维码" description=""/>
                                                <Step title="回答问题" description=""/>
                                                <Step title="完成任务" description=""/>
                                            </Steps>
                                            {
                                                this.props.key4.step1 === 0 ?
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
                                                        <Button onClick={this.handleQRCode.bind(this)}>扫描力量之钥维码</Button>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            {
                                                this.props.key4.step1 === 1 ?
                                                    <div>
                                                        {
                                                            this.props.key4.task?
                                                                <div>
                                                                    {
                                                                        this.props.key4.task.task_type === 'QUESTION' ?
                                                                            <div>
                                                                                {
                                                                                    this.props.key4.task.question_list.map((question, index) => {
                                                                                        if (question.question_type === 'RADIO') {
                                                                                            return (
                                                                                                <div key={index}>
                                                                                                    <WhiteSpace size="lg"/>
                                                                                                    <WhiteSpace size="lg"/>
                                                                                                    <List renderHeader={() => question.question_title}>

                                                                                                    </List>
                                                                                                </div>
                                                                                            );
                                                                                        } else if (question.question_type === 'CHECKBOX') {
                                                                                            return (
                                                                                                <div>
                                                                                                    <WhiteSpace size="lg"/>
                                                                                                    <WhiteSpace size="lg"/>
                                                                                                    <List renderHeader={() => question.question_title}>

                                                                                                    </List>
                                                                                                </div>
                                                                                            );
                                                                                        } else if (question.question_type === 'GAP_FILLING') {
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
                                                                                        }
                                                                                        return null;
                                                                                    })
                                                                                }
                                                                                <WhiteSpace size="lg"/>
                                                                                <WhiteSpace size="lg"/>
                                                                                <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                            </div>
                                                                            :
                                                                            this.props.key4.task.task_type === 'PICTURE' ?
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
                                                                                        <div className="upload-image" onClick={this.handleUploadImage.bind(this)}>
                                                                                            <img src={require('../../assets/image/upload-image.png')} alt=""/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <div className="upload-image-tip">
                                                                                                {this.props.key4.task.task_name}
                                                                                            </div>
                                                                                        </div>
                                                                                    </WingBlank>
                                                                                </div>
                                                                                :
                                                                                this.props.key4.task.task_type === 'RECORD' ?
                                                                                    <div>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WhiteSpace size="xl"/>
                                                                                        <WingBlank size="md">
                                                                                            <Button className="btn center-buttom" type="primary" onClick={this.handleUploadRecord.bind(this)}>开始录音</Button>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <div className="upload-image">
                                                                                                <div className="upload-image-tip">
                                                                                                    一分钟自动完成录音并上传
                                                                                                </div>
                                                                                            </div>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <Button className="btn center-buttom" type="primary" onClick={this.handleStopRecord.bind(this)}>完成录音(上传录音)</Button>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <div className="upload-image">
                                                                                                <div className="upload-image-tip">
                                                                                                    {this.props.key4.task.task_name}
                                                                                                </div>
                                                                                            </div>
                                                                                        </WingBlank>
                                                                                    </div>
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
                                                this.props.key4.step1 === 2 ?
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
                                                            message={`当前钥匙任务完成(${this.props.key4.member_key.task_complete_quantity?this.props.key4.member_key.task_complete_quantity:0}/2)`}
                                                        />
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        this.props.key4.selectedIndex === 1?
                                            <div>
                                                <Steps current={this.props.key4.step2} direction="horizontal">
                                                    <Step title="扫二维码" description=""/>
                                                    <Step title="回答问题" description=""/>
                                                    <Step title="完成任务" description=""/>
                                                </Steps>
                                                {
                                                    this.props.key4.step2 === 0 ?
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
                                                            <Button onClick={this.handleQRCode.bind(this)}>扫描力量之钥维码</Button>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.props.key4.step2 === 1 ?
                                                        <div>
                                                            {
                                                                this.props.key4.task?
                                                                    <div>
                                                                        {
                                                                            this.props.key4.task.task_type === 'QUESTION' ?
                                                                                <div>
                                                                                    {
                                                                                        this.props.key4.task.question_list.map((question, index) => {
                                                                                            if (question.question_type === 'RADIO') {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <WhiteSpace size="lg"/>
                                                                                                        <WhiteSpace size="lg"/>
                                                                                                        <List renderHeader={() => question.question_title}>

                                                                                                        </List>
                                                                                                    </div>
                                                                                                );
                                                                                            } else if (question.question_type === 'CHECKBOX') {
                                                                                                return (
                                                                                                    <div>
                                                                                                        <WhiteSpace size="lg"/>
                                                                                                        <WhiteSpace size="lg"/>
                                                                                                        <List renderHeader={() => question.question_title}>

                                                                                                        </List>
                                                                                                    </div>
                                                                                                );
                                                                                            } else if (question.question_type === 'GAP_FILLING') {
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
                                                                                            }
                                                                                            return null;
                                                                                        })
                                                                                    }
                                                                                    <WhiteSpace size="lg"/>
                                                                                    <WhiteSpace size="lg"/>
                                                                                    <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                                </div>
                                                                                :
                                                                                this.props.key4.task.task_type === 'PICTURE' ?
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
                                                                                            <div className="upload-image" onClick={this.handleUploadImage.bind(this)}>
                                                                                                <img src={require('../../assets/image/upload-image.png')} alt=""/>
                                                                                                <WhiteSpace size="xl"/>
                                                                                                <div className="upload-image-tip">
                                                                                                    {this.props.key4.task.task_name}
                                                                                                </div>
                                                                                            </div>
                                                                                        </WingBlank>
                                                                                    </div>
                                                                                    :
                                                                                    this.props.key4.task.task_type === 'RECORD' ?
                                                                                        <div>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WhiteSpace size="xl"/>
                                                                                            <WingBlank size="md">
                                                                                                <Button className="btn center-buttom" type="primary" onClick={this.handleUploadRecord.bind(this)}>开始录音</Button>
                                                                                                <WhiteSpace size="xl"/>
                                                                                                <div className="upload-image">
                                                                                                    <div className="upload-image-tip">
                                                                                                        一分钟自动完成录音并上传
                                                                                                    </div>
                                                                                                </div>
                                                                                                <WhiteSpace size="xl"/>
                                                                                                <Button className="btn center-buttom" type="primary" onClick={this.handleStopRecord.bind(this)}>完成录音(上传录音)</Button>
                                                                                                <WhiteSpace size="xl"/>
                                                                                                <div className="upload-image">
                                                                                                    <div className="upload-image-tip">
                                                                                                        {this.props.key4.task.task_name}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </WingBlank>
                                                                                        </div>
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
                                                    this.props.key4.step2 === 2 ?
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
                                                                message={`当前钥匙任务完成(${this.props.key4.member_key.task_complete_quantity?this.props.key4.member_key.task_complete_quantity:0}/2)`}
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
                    this.props.key4.is_load && this.props.key4.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.key4.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.key4.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}
Index = createForm()(Index);
export default connect(({key4}) => ({key4}))(Index);
