import React, {Component } from 'react';
import { Pagination } from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

//点击分页按钮函数
function onChange(pageNumber) {
    console.log('Page: ', pageNumber);
}
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        window.socket.on('event', function (data) {

        });
    }

    componentWillUnmount() {
        window.socket.removeAllListeners(['event']);
    }

    render() {
        return (
            <div className="index-02-bg">
                <div className="index-02-main">
                    <div className="index-02-title">课堂视频列表</div>
                    <ul className="video-li">
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                        <li><a href="#">
                            <img src={require('../../image/index_02_video.png')} />
                            <div className="index-02-main-text">党课学习视频二</div>
                        </a></li>
                    </ul>
                    <div className="index-02-page">
                        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
                    </div>
                </div>
            </div>
        );
    }
}

Index.propTypes = {};

export default connect(() => ({}))(Index);
