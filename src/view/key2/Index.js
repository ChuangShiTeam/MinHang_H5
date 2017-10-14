import React, {Component} from 'react';
import {connect} from 'dva';
import {createForm} from "rc-form";
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, List, Button, InputItem, TextareaItem, Radio, Result, Icon} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http';
import notification from '../../util/notification';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "信念之匙";

        this.handleLoadKey();

    }

    componentWillUnmount() {

    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/find',
            data: {
                key_id: this.props.key2.key_id
            },
            success: function (data) {
                let key_is_activated = false;
                if (data.member_key && data.member_key.key_is_activated) {
                    key_is_activated = true;
                }
                let member_task_list = [];
                let step1 = 0;
                let step2 = 0;
                let step3 = 0;
                if (data.member_task_list && data.member_task_list.length > 0) {
                    for (let member_task of data.member_task_list) {
                        if (member_task.key_activated_step === 0) {
                            step1 = 2;
                        } else if (member_task.key_activated_step === 1) {
                            step2 = 2;
                        } else if (member_task.key_activated_step === 2) {
                            step3 = 2;
                        }
                    }
                    member_task_list = data.member_task_list;
                }
                this.props.dispatch({
                    type: 'key2/fetch',
                    data: {
                        key: data.key,
                        member_key: data.member_key,
                        member_task_list: member_task_list,
                        step1: step1,
                        step2: step2,
                        step3: step3,
                        key_is_activated: key_is_activated
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.key2.scroll_top;

                this.props.dispatch({
                    type: 'key2/fetch',
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
                    //TODO 提示扫描错误二维码
                    result = JSON.parse('{\"action\":\"\",\"task_id\":\"50d8f64595e945c8bff694f7bdeb702a\",\"screen_id\":\"0\"}');
                }

                if (result && result.task_id) {
                    that.props.dispatch({
                        type: 'key2/fetch',
                        data: {
                            task_id: result.task_id,
                            secene_id: result.secene_id,
                            action: result.action
                        }
                    });
                    that.handleLoadTask(result.task_id);
                } else {
                    //TODO 提示扫描错误二维码
                }
            }
        });
    }

    handleLoadTask(task_id) {
        this.props.dispatch({
            type: 'key2/fetch',
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
                let step1 = this.props.key2.step1;
                let step2 = this.props.key2.step2;
                let step3 = this.props.key2.step3;
                if (this.props.key2.selectedIndex === 0) {
                    step1 = 1;
                } else if (this.props.key2.selectedIndex === 1) {
                    step2 = 1;
                } else if (this.props.key2.selectedIndex === 2) {
                    step3 = 1;
                }
                this.props.dispatch({
                    type: 'key2/fetch',
                    data: {
                        task: data.task,
                        step1: step1,
                        step2: step2,
                        step3: step3
                    }
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key2/fetch',
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
                values.task_id = this.props.key2.task.task_id;
                values.key_activated_step = this.props.key2.selectedIndex;
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
            type: 'key2/fetch',
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
                    type: 'key2/fetch',
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
                    type: 'key2/fetch',
                    data: {
                        is_record: false
                    }
                });
            }
        });
    }

    handleDownLoadWecatVoice(media_id) {
        this.props.dispatch({
            type: 'key2/fetch',
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
                    type: 'key2/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitRecordTask(file_id) {
        this.props.dispatch({
            type: 'key2/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/member/complete',
            data: {
                task_id: this.props.key2.task_id,
                member_record: {
                    record_file: file_id
                },
                key_activated_step: this.props.key2.selectedIndex
            },
            success: function (data) {
                this.handelSubmitResponse();
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key2/fetch',
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
            type: 'key2/fetch',
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
                    type: 'key2/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitImageTask(file_id) {
        this.props.dispatch({
            type: 'key2/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/member/complete',
            data: {
                task_id: this.props.key2.task_id,
                member_picture: {
                    picture_file: file_id
                },
                key_activated_step: this.props.key2.selectedIndex
            },
            success: function (data) {
                this.handelSubmitResponse();
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key2/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handelSubmitResponse() {
        let step1 = this.props.key2.step1;
        let step2 = this.props.key2.step2;
        let step3 = this.props.key2.step3;
        if (this.props.key2.selectedIndex === 0) {
            step1 = 2;
            notification.emit('sendMessage', {
                targetId: '2',
                action: 'loadPartyHistory',
                content: ''
            });
        } else if (this.props.key2.selectedIndex === 1) {
            step2 = 2;
            notification.emit('sendMessage', {
                targetId: '2',
                action: 'loadPartySong',
                content: ''
            });
        } else if (this.props.key2.selectedIndex === 2) {
            step3 = 2;
        }
        let member_key = this.props.key2.member_key;
        let key_is_activated = false;
        member_key.task_complete_quantity = member_key.task_complete_quantity + 1;
        if (member_key.task_complete_quantity === member_key.task_quantity) {
            member_key.key_is_activated = true;
            key_is_activated = true;
        }
        this.props.dispatch({
            type: 'key2/fetch',
            data: {
                step1: step1,
                step2: step2,
                step3: step3,
                member_key: member_key,
                key_is_activated: key_is_activated
            }
        });

    }

    handleSegmentedControl(event) {
        this.props.dispatch({
            type: 'key2/fetch',
            data: {
                selectedIndex: event.nativeEvent.selectedSegmentIndex
            }
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
                    this.props.key2.key_is_activated === true ?
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
                                    <img src={require('../../assets/image/key2.png')} alt=""/>
                                    <WhiteSpace size="xl"/>
                                    <div className="upload-image-tip">
                                        恭喜你完成任务获得信念钥匙一枚
                                    </div>
                                </div>
                            </WingBlank>
                        </div>
                        :
                        <div>
                            <SegmentedControl selectedIndex={this.props.key2.selectedIndex} values={['读党史', '唱党歌', '按手印']} onChange={this.handleSegmentedControl.bind(this)}/>
                            <WhiteSpace size="lg"/>
                            <WhiteSpace size="lg"/>
                            {
                                this.props.key2.selectedIndex === 0?
                                    <div>
                                        <Steps current={this.props.key2.step1} direction="horizontal">
                                            <Step title="第一步" description="" />
                                            <Step title="第二步" description="" />
                                            <Step title="第三步" description="" />
                                        </Steps>
                                        {
                                            this.props.key2.step1 === 0 ?
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
                                            this.props.key2.step1 === 1 ?
                                                <div>
                                                    {
                                                        this.props.key2.task?
                                                            <div>
                                                                {
                                                                    this.props.key2.task.task_type === 'QUESTION' ?
                                                                        this.props.key2.task.question_list.map((question, index) => {
                                                                            if (question.question_type === 'RADIO') {
                                                                                return (
                                                                                    <div>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <List renderHeader={() => question.question_title}>

                                                                                        </List>
                                                                                    </div>
                                                                                );
                                                                            } else if (question.question_type === 'CHECKBOX') {
                                                                                return '复选题';
                                                                            } else if (question.question_type === 'GAP_FILLING') {
                                                                                return (
                                                                                    <div>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <List renderHeader={() => question.question_title}>
                                                                                            <TextareaItem
                                                                                                {...getFieldProps('question_answer', {
                                                                                                    rules: [{
                                                                                                        required: true,
                                                                                                        message: '请填写答案',
                                                                                                    }],
                                                                                                    initialValue: '',
                                                                                                })}
                                                                                                error={!!getFieldError('question_answer')}
                                                                                                clear
                                                                                                title="答案"
                                                                                                rows={5}
                                                                                                autoHeight
                                                                                                placeholder="请填写答案"
                                                                                            />
                                                                                        </List>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return null;
                                                                        })
                                                                        :
                                                                        this.props.key2.task.task_type === 'PICTURE' ?
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
                                                                                            {this.props.key2.task.task_name}
                                                                                        </div>
                                                                                    </div>
                                                                                </WingBlank>
                                                                            </div>
                                                                            :
                                                                            this.props.key2.task.task_type === 'RECORD' ?
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
                                                                                                {this.props.key2.task.task_name}
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
                                            this.props.key2.step1 === 2 ?
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
                                                        img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                                                        title="验证成功"
                                                        message={`任务完成度(${this.props.key2.member_key.task_complete_quantity?this.props.key2.member_key.task_complete_quantity:0}/3)`}
                                                    />
                                                </div>
                                                :
                                                ''
                                        }
                                    </div>
                                    :
                                this.props.key2.selectedIndex === 1?
                                    <div>
                                        <Steps current={this.props.key2.step2} direction="horizontal">
                                            <Step title="第一步" description="" />
                                            <Step title="第二步" description="" />
                                            <Step title="第三步" description="" />
                                        </Steps>
                                        {
                                            this.props.key2.step2 === 0 ?
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
                                            this.props.key2.step2 === 1 ?
                                                <div>
                                                    {
                                                        this.props.key2.task?
                                                            <div>
                                                                {
                                                                    this.props.key2.task.task_type === 'QUESTION' ?
                                                                        this.props.key2.task.question_list.map((question, index) => {
                                                                            if (question.question_type === 'RADIO') {
                                                                                return (
                                                                                    <div>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <List renderHeader={() => question.question_title}>

                                                                                        </List>
                                                                                    </div>
                                                                                );
                                                                            } else if (question.question_type === 'CHECKBOX') {
                                                                                return '复选题';
                                                                            } else if (question.question_type === 'GAP_FILLING') {
                                                                                return (
                                                                                    <div>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <List renderHeader={() => question.question_title}>
                                                                                            <TextareaItem
                                                                                                {...getFieldProps('question_answer', {
                                                                                                    rules: [{
                                                                                                        required: true,
                                                                                                        message: '请填写答案',
                                                                                                    }],
                                                                                                    initialValue: '',
                                                                                                })}
                                                                                                error={!!getFieldError('question_answer')}
                                                                                                clear
                                                                                                title="答案"
                                                                                                rows={5}
                                                                                                autoHeight
                                                                                                placeholder="请填写答案"
                                                                                            />
                                                                                        </List>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <WhiteSpace size="lg"/>
                                                                                        <Button className="btn" type="primary" onClick={this.handleSubmitQuestion.bind(this)}>提交</Button>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return null;
                                                                        })
                                                                        :
                                                                        this.props.key2.task.task_type === 'PICTURE' ?
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
                                                                                            {this.props.key2.task.task_name}
                                                                                        </div>
                                                                                    </div>
                                                                                </WingBlank>
                                                                            </div>
                                                                            :
                                                                            this.props.key2.task.task_type === 'RECORD' ?
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
                                                                                                {this.props.key2.task.task_name}
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
                                            this.props.key2.step2 === 2 ?
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
                                                        img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                                                        title="验证成功"
                                                        message={`任务完成度(${this.props.key2.member_key.task_complete_quantity?this.props.key2.member_key.task_complete_quantity:0}/3)`}
                                                    />
                                                </div>
                                                :
                                                ''
                                        }
                                    </div>
                                    :
                                    this.props.key2.selectedIndex === 2?
                                        <div>
                                            <Steps current={this.props.key2.step3} direction="horizontal">
                                                <Step title="第一步" description="" />
                                                <Step title="第二步" description="" />
                                                <Step title="第三步" description="" />
                                            </Steps>
                                            {
                                                this.props.key2.step3 === 0 ?
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
                                                this.props.key2.step3 === 1 ?
                                                    <div>
                                                        {
                                                            this.props.key2.task?
                                                                <div>
                                                                    {
                                                                        this.props.key2.task.task_type === 'QUESTION' ?
                                                                            this.props.key2.task.question_list.map((question, index) => {
                                                                                if (question.question_type === 'RADIO') {
                                                                                    return (
                                                                                        <div>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <List renderHeader={() => question.question_title}>

                                                                                            </List>
                                                                                        </div>
                                                                                    );
                                                                                } else if (question.question_type === 'CHECKBOX') {
                                                                                    return '复选题';
                                                                                } else if (question.question_type === 'GAP_FILLING') {
                                                                                    return (
                                                                                        <div>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <List renderHeader={() => question.question_title}>
                                                                                                <TextareaItem
                                                                                                    {...getFieldProps('question_answer', {
                                                                                                        rules: [{
                                                                                                            required: true,
                                                                                                            message: '请填写答案',
                                                                                                        }],
                                                                                                        initialValue: '',
                                                                                                    })}
                                                                                                    error={!!getFieldError('question_answer')}
                                                                                                    clear
                                                                                                    title="答案"
                                                                                                    rows={5}
                                                                                                    autoHeight
                                                                                                    placeholder="请填写答案"
                                                                                                />
                                                                                            </List>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <WhiteSpace size="lg"/>
                                                                                            <Button className="btn" type="primary" onClick={this.handleSubmitQuestionTask.bind(this)}>提交</Button>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })
                                                                            :
                                                                            this.props.key2.task.task_type === 'PICTURE' ?
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
                                                                                                {this.props.key2.task.task_name}
                                                                                            </div>
                                                                                        </div>
                                                                                    </WingBlank>
                                                                                </div>
                                                                                :
                                                                                this.props.key2.task.task_type === 'RECORD' ?
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
                                                                                                    {this.props.key2.task.task_name}
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
                                                this.props.key2.step3 === 2 ?
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
                                                            img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                                                            title="验证成功"
                                                            message={`任务完成度(${this.props.key2.member_key.task_complete_quantity?this.props.key2.member_key.task_complete_quantity:0}/3)`}
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
                    this.props.key2.is_load && this.props.key2.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.key2.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.key2.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}
Index = createForm()(Index);
export default connect(({key2}) => ({key2}))(Index);
