import React, {Component} from 'react';
import {connect} from 'dva';
import {createForm} from "rc-form";
import {routerRedux} from 'dva/router';
import {ActivityIndicator, WhiteSpace, WingBlank, SegmentedControl, Steps, List, Button, TextareaItem, Result, Icon, Toast} from 'antd-mobile';

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

        window.addEventListener('message', function(event) {
            // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
            let loc = event.data;
            if (loc && loc.module === 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                let location_list = this.props.key3.location_list;
                let question_id = this.props.key3.question_id;
                if (location_list.length > 0) {
                    let index = location_list.findIndex(location => location.question_id === question_id);
                    if (index === -1) {
                        location_list.push({
                            question_id: question_id,
                            question_answer: loc.poiaddress
                        })
                    } else {
                        location_list[index] = {
                            question_id: question_id,
                            question_answer: loc.poiaddress
                        };
                    }
                } else {
                    location_list.push({
                        question_id: question_id,
                        question_answer: loc.poiaddress
                    })
                }
                this.props.dispatch({
                    type: 'key3/fetch',
                    data: {
                        location_list: location_list,
                        question_id: '',
                        is_open_map: false
                    }
                });
            }
        }.bind(this), false);

    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'key3/fetch',
            data: {
                description: '信息之钥',
                key_id: '6d1fad4843c94a6bb5131a48b9f38e37',
                is_load: false,
                key: {},
                member_key: {},
                selectedIndex: 0,
                step1: 0,
                step2: 0,
                task_id: '',
                task: null,
                member_task_list: [],
                location_list: [],
                question_id: '',
                question:{},
                is_see_answer: false,
                is_open_map: false,
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
                        key_is_activated: key_is_activated,
                        is_see_answer: false
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
                            action: that.props.key3.selectedIndex === 0 ?'loadLoactionTask':'loadLoactionQuestionTask'
                        },
                        success: function (data) {
                            if (data) {
                                Toast.fail(data, 2);
                            } else {
                                that.props.dispatch({
                                    type: 'key3/fetch',
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
                let question = this.props.key3.question;
                if (this.props.key3.selectedIndex === 0) {
                    step1 = 1;
                } else if (this.props.key3.selectedIndex === 1) {
                    step2 = 1;
                    if (data.task.question_list.length > 0) {
                        question = data.task.question_list[parseInt(data.task.question_list.length*Math.random())];
                    }
                }
                this.props.dispatch({
                    type: 'key3/fetch',
                    data: {
                        task: data.task,
                        step1: step1,
                        step2: step2,
                        question: question
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

    handleSubmitLocationTask() {
        let values = {};
        let location_list = this.props.key3.location_list;
        if (location_list.length > 0) {
            let question_list = this.props.key3.task.question_list;
            let member_question_list = [];

            for (let i = 0; i < question_list.length; i++) {
                let index = location_list.findIndex(location => location.question_id === question_list[i].question_id);
                if (index === -1) {
                    Toast.info('请' + question_list[i].question_title, 1);
                    return;
                }
                member_question_list.push({
                    question_id: location_list[index].question_id,
                    member_answer: location_list[index].question_answer
                })
            }
            values.member_question_list = member_question_list;
            values.task_id = this.props.key3.task.task_id;
            values.key_activated_step = this.props.key3.selectedIndex;
            values.member_task_type =  this.props.key3.selectedIndex === 0? 'LOCATION_QUESTION' : 'INFO_QUESTION';
            http.request({
                url: '/mobile/minhang/task/member/complete',
                data: values,
                success: function (data) {
                    this.handelSubmitResponse();
                }.bind(this),
                complete() {

                }
            });
        } else {
            Toast.info('请标注位置', 1);
        }

    }

    handleSubmitQuestionTask() {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                if (this.props.key3.is_see_answer) {
                    let member_question_list = [];
                    member_question_list.push({
                        question_id: this.props.key3.question.question_id,
                        member_answer: values['question_answer_0']
                    });
                    values.member_question_list = member_question_list;
                    values.task_id = this.props.key3.task.task_id;
                    values.key_activated_step = this.props.key3.selectedIndex;
                    values.member_task_type =  this.props.key3.selectedIndex === 0? 'LOCATION_QUESTION' : 'INFO_QUESTION';
                    http.request({
                        url: '/mobile/minhang/task/member/complete',
                        data: values,
                        success: function (data) {
                            this.handelSubmitResponse();
                        }.bind(this),
                        complete() {

                        }
                    });
                } else {
                    this.props.dispatch({
                        type: 'key3/fetch',
                        data: {
                            is_see_answer: true
                        }
                    });
                }

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
        this.handleLoadKey();
    }

    chooseLocation(question_id) {
        this.props.dispatch({
            type: 'key3/fetch',
            data: {
                question_id: question_id,
                is_open_map: true
            }
        });
    }

    handleCreateHistory() {
        this.props.dispatch({
            type: 'key3/fetch',
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
                    type: 'key3/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleItineraryRestart() {
        this.props.dispatch({
            type: 'key3/fetch',
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
                    type: 'key3/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;
        const Step = Steps.Step;
        const {getFieldProps, getFieldError} = this.props.form;

        return (
            <div>
                {
                    this.props.key3.is_open_map?
                        <iframe id="mapPage" style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}
                                src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
                        </iframe>
                        :
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
                                                    <img src={require('../../assets/image/key3_light.png')} alt=""/>
                                                    <WhiteSpace size="xl"/>
                                                    <div className="upload-image-tip">
                                                        恭喜你完成任务获得信息钥匙一枚
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
                                            <SegmentedControl style={{height: '0.8rem'}} selectedIndex={this.props.key3.selectedIndex} values={['标注位置', '回答问题']} onChange={this.handleSegmentedControl.bind(this)}/>
                                            <WhiteSpace size="lg"/>
                                            <WhiteSpace size="lg"/>
                                            {
                                                this.props.key3.selectedIndex === 0?
                                                    <div>
                                                        <Steps current={this.props.key3.step1} direction="horizontal">
                                                            <Step title="扫描二维码" description=""/>
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
                                                                        <Button onClick={this.handleQRCode.bind(this)}>扫描位置二维码</Button>
                                                                    </WingBlank>
                                                                </div>
                                                                :
                                                                ''
                                                        }
                                                        {
                                                            this.props.key3.step1 === 1 ?
                                                                <div>
                                                                    <WhiteSpace size="lg"/>
                                                                    <WhiteSpace size="lg"/>
                                                                    {
                                                                        this.props.key3.task?
                                                                            <div>
                                                                                <List>
                                                                                    {
                                                                                        this.props.key3.task.question_list.map((question, index) =>
                                                                                            <Item key={index}
                                                                                                  arrow="horizontal"
                                                                                                  multipleLine
                                                                                                  thumb={require('../../assets/svg/map.svg')}
                                                                                                  onClick={this.chooseLocation.bind(this, question.question_id)}>
                                                                                                {question.question_title }
                                                                                                <Brief>
                                                                                                    {this.props.key3.location_list.length > 0 ?
                                                                                                        (this.props.key3.location_list.findIndex(location => location.question_id === question.question_id) === -1
                                                                                                            ? <span style={{color: 'red'}}>未标注</span>
                                                                                                            :
                                                                                                            this.props.key3.location_list[this.props.key3.location_list.findIndex(location => location.question_id === question.question_id)].question_answer)
                                                                                                        :
                                                                                                        <span style={{color: 'red'}}>未标注</span>
                                                                                                    }
                                                                                                </Brief>
                                                                                            </Item>
                                                                                        )
                                                                                    }
                                                                                </List>
                                                                                <WhiteSpace size="lg"/>
                                                                                <WhiteSpace size="lg"/>
                                                                                <Button className="btn" type="primary" onClick={this.handleSubmitLocationTask.bind(this)}>提交</Button>
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
                                                                <Step title="扫描二维码" description=""/>
                                                                <Step title="回答问题" description=""/>
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
                                                                            <Button onClick={this.handleQRCode.bind(this)}>扫描答题二维码</Button>
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
                                                                                        this.props.key3.task.question_list.length > 0 && this.props.key3.question.question_title?
                                                                                            <div>
                                                                                                <WhiteSpace size="lg"/>
                                                                                                <WhiteSpace size="lg"/>
                                                                                                <List renderHeader={() => this.props.key3.question.question_title}
                                                                                                      renderFooter={() => this.props.key3.is_see_answer?'正确答案：' + this.props.key3.question.question_answer_list[0].question_answer:null}
                                                                                                >
                                                                                                    <TextareaItem
                                                                                                        {...getFieldProps(`question_answer_0`, {
                                                                                                            rules: [{
                                                                                                                required: true,
                                                                                                                message: '请填写答案'
                                                                                                            }],
                                                                                                            initialValue: ''
                                                                                                        })}
                                                                                                        error={!!getFieldError(`question_answer_0`)}
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
                                                                                            :
                                                                                            null
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
                }
            </div>
        );
    }
}
Index = createForm()(Index);
export default connect(({key3}) => ({key3}))(Index);
