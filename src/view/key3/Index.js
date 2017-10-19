import React, {Component} from 'react';
import {connect} from 'dva';
import {createForm} from "rc-form";
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, List, Button, InputItem, TextareaItem, Radio, Result, Icon, Toast} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        document.title = "信息之钥";

        this.handleLoadKey();

    }

    componentWillUnmount() {

    }

    handleLoadKey() {
        http.request({
            url: '/mobile/minhang/key/find',
            data: {
                key_id: this.props.key3.key_id
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
                    type: 'key3/fetch',
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
                document.body.scrollTop = this.props.key3.scroll_top;

                this.props.dispatch({
                    type: 'key3/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleRecognizeQrcode(task_id) {
        this.props.dispatch({
            type: 'key3/fetch',
            data: {
                task_id: task_id
            }
        });
        this.handleLoadTask(task_id);
    }

    handleLoadTask(task_id) {
        this.props.dispatch({
            type: 'key3/fetch',
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
                let step1 = this.props.key3.step1;
                let step2 = this.props.key3.step2;
                if (this.props.key3.selectedIndex === 0) {
                    step1 = 1;
                } else if (this.props.key3.selectedIndex === 1) {
                    step2 = 1;
                }
                this.props.dispatch({
                    type: 'key3/fetch',
                    data: {
                        task: data.task,
                        step1: step1,
                        step2: step2
                    }
                });
            }.bind(this),
            complete: function () {
                this.props.dispatch({
                    type: 'key3/fetch',
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
                let question_list = this.props.key3.task.question_list;
                let member_question_list = [];
                for (let i = 0; i < question_list.length; i++) {
                    member_question_list.push({
                        question_id: question_list[i].question_id,
                        member_answer: values['question_answer_' + i]
                    })
                }
                values.member_question_list = member_question_list;
                values.task_id = this.props.key3.task.task_id;
                values.key_activated_step = this.props.key3.selectedIndex;
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

    handleSubmitLocationTask() {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                let question_list = this.props.key3.task.question_list;
                let location_list = this.props.key3.task.location_list;
                let member_question_list = [];
                for (let i = 0; i < question_list.length; i++) {
                    let index = location_list.findIndex(location => location.question_id === question_list[i].question_id);
                    if (index === -1) {
                        Toast.info("请" + question_list[i].question_title, 1);
                        break;
                    }
                    member_question_list.push({
                        question_id: question_list[i].question_id,
                        member_answer: location_list[index].accuracy
                    })
                }
                values.member_question_list = member_question_list;
                values.task_id = this.props.key3.task.task_id;
                values.key_activated_step = this.props.key3.selectedIndex;
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
        let step1 = this.props.key3.step1;
        let step2 = this.props.key3.step2;
        let selectedIndex = this.props.key3.selectedIndex;
        if (selectedIndex === 0) {
            step1 = 2;
            selectedIndex = 1;
        } else if (selectedIndex === 1) {
            step2 = 2;
            selectedIndex = 0;
        }
        let member_key = this.props.key3.member_key;
        let key_is_activated = false;
        member_key.task_complete_quantity = member_key.task_complete_quantity + 1;
        if (member_key.task_complete_quantity === member_key.task_quantity) {
            member_key.key_is_activated = true;
            key_is_activated = true;
        }
        this.props.dispatch({
            type: 'key3/fetch',
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
            type: 'key3/fetch',
            data: {
                selectedIndex: event.nativeEvent.selectedSegmentIndex
            }
        });
    }

    handleChooseLocation(question_id) {
        window.wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                let location_list = this.props.key3.location_list;
                let index = location_list.findIndex(location => location.question_id === question_id);
                if (index === -1) {
                    location_list.push({
                        question_id: question_id,
                        latitude: latitude,
                        longitude: longitude,
                        speed: speed,
                        accuracy: accuracy
                    });
                } else {
                    location_list[index] = {
                        question_id: question_id,
                        latitude: latitude,
                        longitude: longitude,
                        speed: speed,
                        accuracy: accuracy
                    }
                }
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
                        this.props.key3.key_is_activated === true ?
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
                                        <img src={require('../../assets/image/key3.png')} alt=""/>
                                        <WhiteSpace size="xl"/>
                                        <div className="upload-image-tip">
                                            恭喜你完成任务获得信息钥匙一枚
                                        </div>
                                    </div>
                                </WingBlank>
                            </div>
                            :
                            <div>
                                <SegmentedControl style={{height: '0.8rem'}} selectedIndex={this.props.key3.selectedIndex} values={['标注位置', '答题']} onChange={this.handleSegmentedControl.bind(this)}/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                {
                                    this.props.key3.selectedIndex === 0?
                                        <div>
                                            <Steps current={this.props.key3.step1} direction="horizontal">
                                                <Step title="识别二维码" description=""/>
                                                <Step title="标注位置" description=""/>
                                                <Step title="完成任务" description=""/>
                                            </Steps>
                                            {
                                                this.props.key3.step1 === 0 ?
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
                                                        <WingBlank size="md">
                                                            <div className="qrcode-image" onClick={this.handleRecognizeQrcode.bind(this, '5f8af80e33c94dcf9952220c31274fe4')}>
                                                                <img src={constant.host + '/upload/8acc2d49ad014f418878d1a16336c16b/5f8af80e33c94dcf9952220c31274fe4.png'} alt=""/>
                                                                <WhiteSpace size="xl"/>
                                                                <div className="qrcode-image-tip">
                                                                    点击识别二维码
                                                                </div>
                                                            </div>
                                                        </WingBlank>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            {
                                                this.props.key3.step1 === 1 ?
                                                    <div>
                                                        {
                                                            this.props.key3.task?
                                                                <div>
                                                                    {
                                                                        this.props.key3.task.task_type === 'QUESTION' ?
                                                                            <List>
                                                                                <WhiteSpace size="lg"/>
                                                                                <WhiteSpace size="lg"/>
                                                                                {
                                                                                    this.props.key3.task.question_list.map((question, index) =>
                                                                                        <Item arrow="horizontal"
                                                                                              key={index} onClick={this.handleChooseLocation.bind(this)}>
                                                                                            {question.question_title}
                                                                                        </Item>
                                                                                    )
                                                                                }
                                                                                <WhiteSpace size="lg"/>
                                                                                <WhiteSpace size="lg"/>
                                                                                <Button className="btn" type="primary" onClick={this.handleSubmitLocationTask.bind(this)}>提交</Button>
                                                                            </List>
                                                                            :
                                                                            this.props.key3.task.task_type === 'PICTURE' ?
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
                                                                                                {this.props.key3.task.task_name}
                                                                                            </div>
                                                                                        </div>
                                                                                    </WingBlank>
                                                                                </div>
                                                                                :
                                                                                this.props.key3.task.task_type === 'RECORD' ?
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
                                                                                                    {this.props.key3.task.task_name}
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
                                                this.props.key3.step1 === 2 ?
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
                                                            message={`当前钥匙任务完成(${this.props.key3.member_key.task_complete_quantity?this.props.key3.member_key.task_complete_quantity:0}/2)`}
                                                        />
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        this.props.key3.selectedIndex === 1?
                                            <div>
                                                <Steps current={this.props.key3.step2} direction="horizontal">
                                                    <Step title="识别二维码" description=""/>
                                                    <Step title="答题" description=""/>
                                                    <Step title="完成任务" description=""/>
                                                </Steps>
                                                {
                                                    this.props.key3.step2 === 0 ?
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
                                                            <WingBlank size="md">
                                                                <div className="qrcode-image" onClick={this.handleRecognizeQrcode.bind(this, 'd14b3a04d7f24be088ef90b23f51cfb1')}>
                                                                    <img src={constant.host + '/upload/8acc2d49ad014f418878d1a16336c16b/d14b3a04d7f24be088ef90b23f51cfb1.png'} alt=""/>
                                                                    <WhiteSpace size="xl"/>
                                                                    <div className="qrcode-image-tip">
                                                                        点击识别二维码
                                                                    </div>
                                                                </div>
                                                            </WingBlank>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.props.key3.step2 === 1 ?
                                                        <div>
                                                            {
                                                                this.props.key3.task?
                                                                    <div>
                                                                        {
                                                                            this.props.key3.task.task_type === 'QUESTION' ?
                                                                                <div>
                                                                                    {
                                                                                        this.props.key3.task.question_list.map((question, index) => {
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
                                                                                this.props.key3.task.task_type === 'PICTURE' ?
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
                                                                                                    {this.props.key3.task.task_name}
                                                                                                </div>
                                                                                            </div>
                                                                                        </WingBlank>
                                                                                    </div>
                                                                                    :
                                                                                    this.props.key3.task.task_type === 'RECORD' ?
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
                                                                                                        {this.props.key3.task.task_name}
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
                                                    this.props.key3.step2 === 2 ?
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
                                                                message={`当前钥匙任务完成(${this.props.key3.member_key.task_complete_quantity?this.props.key3.member_key.task_complete_quantity:0}/2)`}
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
                    this.props.key3.is_load && this.props.key3.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.key3.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.key3.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}
Index = createForm()(Index);
export default connect(({key3}) => ({key3}))(Index);
