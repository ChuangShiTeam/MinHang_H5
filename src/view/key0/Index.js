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

        document.body.scrollTop = this.props.key0.scroll_top;

        this.props.dispatch({
            type: 'key0/fetch',
            data: {
                is_load: true
            }
        });
    }

    componentWillUnmount() {

    }

    handleSegmentedControl(event) {
        this.props.dispatch({
            type: 'key0/fetch',
            data: {
                step: event.nativeEvent.selectedSegmentIndex
            }
        });
    }

    handleQRCode() {
        window.wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode"],
            success: function (response) {
                console.log(response);
            }
        });
        console.log(456);
    }

    render() {
        const Item = List.Item;
        const Step = Steps.Step;

        return (
            <div>
                <WhiteSpace size="lg"/>
                <WingBlank mode={20}>
                    <SegmentedControl selectedIndex={this.props.key0.step} values={['切换一', '切换二', '切换三']} onChange={this.handleSegmentedControl.bind(this)} />
                    <WhiteSpace size="lg"/>
                    <WhiteSpace size="lg"/>
                    {
                        this.props.key0.step == 0 ?
                            <div>
                                <Steps current={1} direction="horizontal">
                                    <Step title="第一步" description="" />
                                    <Step title="第二步" description="" />
                                    <Step title="第三步" description="" />
                                </Steps>
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
                            </div>
                            :
                            ''
                    }
                    {
                        this.props.key0.step == 2 ?
                            <div>
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
