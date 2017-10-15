import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WhiteSpace, WingBlank, Button} from 'antd-mobile';

import notification from '../util/notification';

class Record extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_start: false,
            is_record: false,
            localId: ''
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleStartRecord() {
        this.setState({
            is_start: true
        });

        window.wx.startRecord();

        notification.emit('notification_' + this.props.id + '_start_record', {});

        window.wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function (res) {
                this.setState({
                    is_start: false,
                    is_record: true,
                    localId: res.localId
                });
            }.bind(this)
        });
    }

    handleStopRecord() {
        window.wx.stopRecord({
            success: function (res) {
                this.setState({
                    is_start: false,
                    is_record: true,
                    localId: res.localId
                });

                notification.emit('notification_' + this.props.id + '_stop_record', {
                    localId: res.localId
                });
            }.bind(this)
        });
    }

    handleUploadRecord() {
        var localId = this.state.localId;
        window.wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                notification.emit('notification_' + this.props.id + '_upload_record', {
                    serverId: res.serverId
                });
            }.bind(this)
        });
    }

    render() {

        return (
            <div>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WingBlank size="md">
                    {
                        this.state.is_start ?
                            <Button type="primary" onClick={this.handleStopRecord.bind(this)}>停止录音</Button>
                            :
                            <Button icon="check-circle-o" type="primary" onClick={this.handleStartRecord.bind(this)}>开始录音</Button>

                    }
                    <WhiteSpace size="xl"/>
                    <div className="upload-image">
                        <div className="upload-image-tip">
                            一分钟自动完成录音并上传
                        </div>
                    </div>
                    <WhiteSpace size="xl"/>
                    {
                        !this.state.is_start && this.state.is_record ?
                            <Button icon="check-circle-o"  type="primary" onClick={this.handleUploadRecord.bind(this)}>完成录音(上传录音)</Button>
                            :
                            ""

                    }
                    <WhiteSpace size="xl"/>
                    <div className="upload-image">
                        <div className="upload-image-tip">
                            {this.props.task_name}
                        </div>
                    </div>
                </WingBlank>
            </div>
        );
    }
}

Record.propTypes = {
    id: PropTypes.string.isRequired,
    task_name: PropTypes.string.isRequired
};

Record.defaultProps = {

};

export default Record;
