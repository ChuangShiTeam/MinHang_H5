import React, {Component } from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import Slider from 'react-slick';

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

    handleNext() {
        this.slider.slickNext();
    }
    handlePrevious() {
        this.slider.slickPrev();
    }

    render() {
        return (
            <div className="index-00-bg">
                <div className="bottom-position">
                    <div className="bottom-carousel">
                        <Slider ref={c => this.slider = c } {...{
                            infinite: true,
                            speed: 500,
                            slidesToScroll: 4,
                            slidesToShow: 4,
                            arrows: false
                        }}>
                            <div className="bottom-li"><img src={require('../../image/index_00_but01.png')} /></div>
                            <div className="bottom-li"><img src={require('../../image/index_00_but01.png')} /></div>
                            <div className="bottom-li"><img src={require('../../image/index_00_but01.png')} /></div>
                            <div className="bottom-li"><img src={require('../../image/index_00_but01.png')} /></div>
                        </Slider>

                    </div>
                    <div>
                        <span className='button_previous' onClick={this.handlePrevious.bind(this)}>
                            <img src={require('../../image/index_00_pre.png')} />
                        </span>
                        <span className='button_next' onClick={this.handleNext.bind(this)}>
                            <img src={require('../../image/index_00_next.png')} />
                        </span>
                    </div>
                </div>

                <div className="side">
                    <div className="public_signal">
                        <img src={require('../../image/code_img_00.png')} />
                        <p>扫二维码关注公众号</p>
                    </div>
                    <div className="member">
                        <p>登陆成功的党员</p>
                        <ul>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg01.png')} /></span>
                                <span>微信名字</span>
                            </li>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg02.png')} /></span>
                                <span>微信名字</span>
                            </li>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg03.png')} /></span>
                                <span>微信名字</span>
                            </li>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg01.png')} /></span>
                                <span>微信名字</span>
                            </li>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg02.png')} /></span>
                                <span>微信名字</span>
                            </li>
                            <li>
                                <span className="uner_img"><img src={require('../../image/index_00_uimg03.png')} /></span>
                                <span>微信名字</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Index.propTypes = {};

export default connect(() => ({}))(Index);
