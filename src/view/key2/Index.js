import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from "dva/router";
import {
    ActivityIndicator,
    WhiteSpace,
    WingBlank,
    SegmentedControl,
    Steps,
    List,
    Button,
    Radio,
    Result,
    Icon,
    Toast
} from 'antd-mobile';
import Record from '../Record';

import http from '../../util/http';
import notification from '../../util/notification';
import Picture from '../Picture';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        document.title = "信念之钥";

        this.handleLoadKey();

        notification.on('notification_2_start_record', this, function (data) {
            this.props.dispatch({
                type: 'key2/fetch',
                data: {
                    is_record: true
                }
            });
        });

        notification.on('notification_2_stop_record', this, function (data) {

        });

        notification.on('notification_2_upload_record', this, function (data) {
            this.handleDownLoadWecatVoice(data.serverId);

            this.props.dispatch({
                type: 'key2/fetch',
                data: {
                    is_record: false
                }
            });
        });

        notification.on('notification_2_picture', this, function (data) {
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
                                this.handleDownLoadWecatImage(serverId);  //后台下载图片
                            }.bind(this)
                        });
                    }
                }.bind(this)
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_2_start_record', this);

        notification.remove('notification_2_stop_record', this);

        notification.remove('notification_2_upload_record', this);

        notification.remove('notification_2_picture', this);
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
                    Toast.fail('请扫描正确二维码', 2);
                }

                if (result && result.task_id) {
                    http.request({
                        url: '/mobile/minhang/task/check',
                        data: {
                            task_id: result.task_id,
                            action: that.props.key2.selectedIndex === 0?'loadPartyHistory':that.props.key2.selectedIndex === 1?'loadPartySong':'loadHandlePrint'
                        },
                        success: function (data) {
                            if (data) {
                                Toast.fail(data, 2);
                            } else {
                                that.props.dispatch({
                                    type: 'key2/fetch',
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
        let selectedIndex = this.props.key2.selectedIndex;
        if (selectedIndex === 0) {
            step1 = 2;
            selectedIndex = (step2 === 2?2:1);
            notification.emit('sendMessage', {
                targetId: '2',
                action: 'loadPartyHistory',
                content: ''
            });
        } else if (selectedIndex === 1) {
            step2 = 2;
            selectedIndex = (step3 === 2?0:2);
            notification.emit('sendMessage', {
                targetId: '2',
                action: 'loadPartySong',
                content: ''
            });
        } else if (selectedIndex === 2) {
            step3 = 2;
            selectedIndex = (step1 === 2?1:0);
            notification.emit('sendMessage', {
                targetId: '3',
                action: 'loadHandlePrint',
                content: ''
            });
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
                selectedIndex: selectedIndex,
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
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleCreateHistory.bind(this)}>生成纪念册</Button>
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleItineraryRestart.bind(this)}>重启寻钥之旅</Button>
                            </div>
                            :
                            <div>
                                <SegmentedControl style={{height: '0.8rem'}}
                                                  selectedIndex={this.props.key2.selectedIndex}
                                                  values={['读党史', '唱党歌', '按手印']}
                                                  onChange={this.handleSegmentedControl.bind(this)}/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                {
                                    this.props.key2.selectedIndex === 0 ?
                                        <div>
                                            <Steps current={this.props.key2.step1} direction="horizontal">
                                                <Step title="扫二维码" description=""/>
                                                <Step title="读党史录音" description=""/>
                                                <Step title="完成任务" description=""/>
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
                                                        <Button onClick={this.handleQRCode.bind(this)}>扫描读党史二维码</Button>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            {
                                                this.props.key2.step1 === 1 ?
                                                    <Record id="2" task_name={this.props.key2.task.task_name}/>
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
                                                            img={<Icon type="check-circle" className="icon"
                                                                       style={{width: '1.2rem', height: '1.2rem', fill: '#d3414c'}}/>}
                                                            title="任务已完成"
                                                            message={`当前钥匙任务完成(${this.props.key2.member_key.task_complete_quantity ? this.props.key2.member_key.task_complete_quantity : 0}/3)`}
                                                        />
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                        :
                                        this.props.key2.selectedIndex === 1 ?
                                            <div>
                                                <Steps current={this.props.key2.step2} direction="horizontal">
                                                    <Step title="扫二维码" description=""/>
                                                    <Step title="唱党歌录音" description=""/>
                                                    <Step title="完成任务" description=""/>
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
                                                            <Button
                                                                onClick={this.handleQRCode.bind(this)}>扫描唱党歌二维码</Button>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.props.key2.step2 === 1 ?
                                                        <Record id="2" task_name={this.props.key2.task.task_name}/>
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
                                                                img={<Icon type="check-circle" className="icon"
                                                                           style={{width: '1.2rem', height: '1.2rem', fill: '#d3414c'}}/>}
                                                                title="任务已完成"
                                                                message={`当前钥匙任务完成(${this.props.key2.member_key.task_complete_quantity ? this.props.key2.member_key.task_complete_quantity : 0}/3)`}
                                                            />
                                                        </div>
                                                        :
                                                        ''
                                                }
                                            </div>
                                            :
                                            this.props.key2.selectedIndex === 2 ?
                                                <div>
                                                    <Steps current={this.props.key2.step3} direction="horizontal">
                                                        <Step title="扫二维码" description=""/>
                                                        <Step title="上传手印" description=""/>
                                                        <Step title="完成任务" description=""/>
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
                                                                <Button
                                                                    onClick={this.handleQRCode.bind(this)}>扫描上传手印二维码</Button>
                                                            </div>
                                                            :
                                                            ''
                                                    }
                                                    {
                                                        this.props.key2.step3 === 1 ?
                                                            <Picture id="2" task_name={this.props.key2.task.task_name}/>
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
                                                                    img={<Icon type="check-circle" className="icon"
                                                                               style={{width: '1.2rem', height: '1.2rem', fill: '#d3414c'}}/>}
                                                                    title="任务已完成"
                                                                    message={`当前钥匙任务完成(${this.props.key2.member_key.task_complete_quantity ? this.props.key2.member_key.task_complete_quantity : 0}/3)`}
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

export default connect(({key2}) => ({key2}))(Index);
