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
    Toast
} from 'antd-mobile';
import Picture from '../Picture';

import http from '../../util/http';
import notification from '../../util/notification';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        document.title = "激情之钥";

        this.handleLoadKey();

        notification.on('notification_0_picture', this, function (data) {
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
        notification.remove('notification_0_picture', this);
        this.props.dispatch({
            type: 'key0/fetch',
            data: {
                description: '激情之钥',
                key_id: 'f9892bc1d79c46e2a06042a935ac02fb',
                is_load: false,
                key: {},
                member_key: {},
                selectedIndex: 0,
                step: 0,
                task_id: '',
                task: null,
                member_task: null,
                file: null,
                is_record: false,
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
                            action: 'loadPoster'
                        },
                        success: function (data) {
                            if (data) {
                                Toast.fail(data, 2);
                            } else {
                                that.props.dispatch({
                                    type: 'key0/fetch',
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
            type: 'key0/fetch',
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
                let step = 1;
                if (data.member_task) {
                    step = 2
                }
                this.props.dispatch({
                    type: 'key0/fetch',
                    data: {
                        task: data.task,
                        member_task: data.member_task ? data.member_task : null,
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

    handleDownLoadWecatImage(media_id) {
        this.props.dispatch({
            type: 'key0/fetch',
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
                    type: 'key0/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleSubmitImageTask(file_id) {
        this.props.dispatch({
            type: 'key0/fetch',
            data: {
                is_load: false
            }
        });
        http.request({
            url: '/mobile/minhang/task/member/complete',
            data: {
                task_id: this.props.key0.task_id,
                key_activated_step: this.props.key0.selectedIndex,
                member_picture: {
                    picture_file: file_id
                },
                member_task_type: 'POSTER_PICTURE'
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'key0/fetch',
                    data: {
                        step: 2
                    }
                });
                notification.emit('sendMessage', {
                    targetId: '0',
                    action: 'loadPoster',
                    content: ''
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
                        this.props.key0.step != 2 ?
                            <div>
                                <SegmentedControl style={{height: '0.8rem'}} selectedIndex={this.props.key0.selectedIndex}
                                                  values={['上传微笑照片']}/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <Steps current={this.props.key0.step} direction="horizontal">
                                    <Step title="扫二维码" description=""/>
                                    <Step title="上传笑脸" description=""/>
                                    <Step title="完成任务" description=""/>
                                </Steps>
                            </div>
                            : null

                    }
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
                                <Button onClick={this.handleQRCode.bind(this)}>扫描激情之钥二维码</Button>
                            </div>
                            :
                            ''
                    }
                    {
                        this.props.key0.step == 1 ?
                            <Picture id="0" task_name={this.props.key0.task.task_name}/>
                            :
                            ''
                    }
                    {
                        this.props.key0.step == 2 ?
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
                                        <img src={require('../../assets/image/key0.png')} alt=""/>
                                        <WhiteSpace size="xl"/>
                                        <div className="upload-image-tip">
                                            恭喜你完成任务获得激情钥匙一枚
                                        </div>
                                    </div>
                                </WingBlank>
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleCreateHistory.bind(this)}>生成纪念册</Button>
                                <WhiteSpace size="xl"/>
                                <Button type="primary" onClick={this.handleItineraryRestart.bind(this)}>重启寻钥之旅</Button>
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
