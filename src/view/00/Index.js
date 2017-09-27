import React, {Component} from 'react';
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

    render() {
        return (
            <div className="index-00-bg">
                <Slider {...{
                    infinite: true,
                    speed: 500,
                    slidesToScroll: 4,
                    slidesToShow: 4
                }}>
                    <div><img src='http://placekitten.com/g/400/200' /></div>
                    <div><img src='http://placekitten.com/g/400/200' /></div>
                    <div><img src='http://placekitten.com/g/400/200' /></div>
                    <div><img src='http://placekitten.com/g/400/200' /></div>
                </Slider>
            </div>
        );
    }
}

Index.propTypes = {};

export default connect(() => ({}))(Index);
