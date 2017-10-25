import React, {Component} from 'react';
import {connect} from 'dva';
import {
    ActivityIndicator,
    WhiteSpace,
    WingBlank,
    Carousel,
    List,
    Button,
    Icon
} from 'antd-mobile';

import http from '../../util/http';
import constant from '../../util/constant';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        document.title = "我的纪念册";

        this.handleLoadHistory();
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'history/fetch',
            data: {
                is_load: false,
                poster_picture: {},
                party_history_record: {},
                party_song_record: {},
                hand_print_picture: {},
                location_question: [],
                info_question: {},
                timeline_event_question: [],
                video_question: [],
                selectedIndex: 0,
                count: 6,
                scroll_top: 0
            }
        });
    }

    handleLoadHistory() {
        http.request({
            url: '/mobile/minhang/member/history/find',
            data: {
                member_history_id: this.props.params.history_id
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'history/fetch',
                    data: {
                        poster_picture: data.POSTER_PICTURE?data.POSTER_PICTURE:{},
                        party_history_record: data.PARTY_HISTORY_RECORD?data.PARTY_HISTORY_RECORD:{},
                        party_song_record: data.PARTY_SONG_RECORD?data.PARTY_SONG_RECORD:{},
                        hand_print_picture: data.HAND_PRINT_PICTURE?data.HAND_PRINT_PICTURE:{},
                        location_question: data.LOCATION_QUESTION?data.LOCATION_QUESTION:[],
                        info_question: data.INFO_QUESTION?data.INFO_QUESTION:{},
                        timeline_event_question: data.TIMELINE_EVENT_QUESTION?data.TIMELINE_EVENT_QUESTION:[],
                        video_question: data.VIDEO_QUESTION?data.VIDEO_QUESTION:[],
                    }
                });
            }.bind(this),
            complete: function () {
                document.body.scrollTop = this.props.history.scroll_top;

                this.props.dispatch({
                    type: 'history/fetch',
                    data: {
                        is_load: true
                    }
                });
            }.bind(this)
        });
    }

    handleCarousel() {
        let selectedIndex = this.props.history.selectedIndex;
        this.props.dispatch({
            type: 'history/fetch',
            data: {
                selectedIndex: selectedIndex + 1
            }
        });
    }

    afterChange(index) {
        this.props.dispatch({
            type: 'history/fetch',
            data: {
                selectedIndex: index
            }
        });
    }

    render() {
        const Item = List.Item;
        return (
            <div>
                <div>
                <Carousel vertical={true}
                          dots={false}
                          selectedIndex={this.props.history.selectedIndex}
                          afterChange={this.afterChange.bind(this)}
                          swipeSpeed={35}>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key0.png')} alt=""/>
                        </div>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.poster_picture.file_path?
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            自拍了一张笑脸
                                        </div>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-image" >
                                            <img
                                                style={{width: document.documentElement.clientWidth * 0.45, height: document.documentElement.clientHeight * 0.22 + 'px'}}
                                                src={"http://api.chuangshi.nowui.com" + this.props.history.poster_picture.file_path} alt=""/>
                                        </div>
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <div className="history-result-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key1.png')} alt=""/>
                        </div>
                        <WhiteSpace size="lg"/>
                        <WingBlank size="lg">
                            <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <WhiteSpace size="lg"/>
                                <div className="history-result-tip">
                                    未激活
                                </div>
                            </div>
                        </WingBlank>
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key2.png')} alt=""/>
                        </div>
                        <WhiteSpace size="md"/>
                        {
                            this.props.history.party_history_record.file_path && this.props.history.party_song_record.file_path && this.props.history.hand_print_picture.file_path?
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.13 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            朗读了一段党史
                                        </div>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-audio">
                                            <audio src={"http://api.chuangshi.nowui.com" + this.props.history.party_history_record.file_path} controls="controls"></audio>
                                        </div>
                                    </div>
                                    <WhiteSpace size="xs"/>
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.13 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            歌唱了一首党歌
                                        </div>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-audio">
                                            <audio src={"http://api.chuangshi.nowui.com" + this.props.history.party_song_record.file_path} controls="controls"></audio>
                                        </div>
                                    </div>
                                    <WhiteSpace size="xs"/>
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            手印
                                        </div>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-image">
                                            <img style={{width: document.documentElement.clientWidth * 0.45, height: document.documentElement.clientHeight * 0.22 + 'px'}}
                                                src={"http://api.chuangshi.nowui.com" + this.props.history.hand_print_picture.file_path} alt=""/>
                                        </div>
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <div className="history-result-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key3.png')} alt=""/>
                        </div>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.location_question.length > 0 && this.props.history.info_question.question ?
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="sm"/>
                                        <div className="history-result-tip">
                                            标注了位置信息
                                        </div>
                                        <WhiteSpace size="sm"/>
                                        <List>
                                        {
                                            this.props.history.location_question.length > 0 ? this.props.history.location_question.map((location, index) =>
                                                <Item key={index}
                                                      thumb={require('../../assets/svg/map.svg')}>
                                                    <div className="history-result-location">
                                                        {location.question.question_title}({location.member_answer})
                                                    </div>
                                                </Item>
                                            )
                                                :
                                                null

                                        }
                                        </List>
                                    </div>
                                    <WhiteSpace size="xs"/>
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            回答了一道问题
                                        </div>
                                        <WhiteSpace size="md"/>
                                        {
                                            this.props.history.info_question.question?
                                                <div>
                                                    <div className="history-result-question-title">
                                                        问：{this.props.history.info_question.question.question_title}
                                                    </div>
                                                    <WhiteSpace size="xs"/>
                                                    <div className="history-result-question-answer">
                                                        答：{this.props.history.info_question.member_answer}
                                                    </div>
                                                </div>
                                                :
                                                null

                                        }
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <div className="history-result-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }

                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key4.png')} alt=""/>
                        </div>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.timeline_event_question.length > 0 ?
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            回答了两道问题
                                        </div>
                                        <WhiteSpace size="md"/>
                                        {
                                            this.props.history.timeline_event_question.map((timeline_event, index) =>
                                                <div key={index}>
                                                    <div className="history-result-question-title">
                                                        问：{timeline_event.question.question_title}
                                                    </div>
                                                    <WhiteSpace size="xs"/>
                                                    <div className="history-result-question-answer">
                                                        答：{timeline_event.member_answer}
                                                    </div>
                                                    <WhiteSpace size="xl"/>
                                                </div>
                                            )

                                        }
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <div className="history-result-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <div className="history-key">
                            <img src={require('../../assets/image/key5.png')} alt=""/>
                        </div>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.video_question.length > 0 ?
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="md"/>
                                        <div className="history-result-tip">
                                            回答了两道问题
                                        </div>
                                        <WhiteSpace size="md"/>
                                        {
                                            this.props.history.video_question.map((video, index) =>
                                                <div key={index}>
                                                    <div className="history-result-question-title">
                                                        问：{video.question.question_title}
                                                    </div>
                                                    <WhiteSpace size="xs"/>
                                                    <div className="history-result-question-answer">
                                                        答：{video.member_answer}
                                                    </div>
                                                    <WhiteSpace size="xl"/>
                                                </div>
                                            )
                                        }
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="lg">
                                    <div className="history-result" style={{height: document.documentElement.clientHeight * 0.3 + 'px'}}>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <div className="history-result-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                </Carousel>
                </div>
                {
                    this.props.history.selectedIndex < (this.props.history.count - 1) ?
                        <div className="history-footer">
                            <a onClick={this.handleCarousel.bind(this)}>
                                <div>下一页</div>
                                <img src={require('../../assets/svg/drop-down.svg')} alt=""/>
                            </a>
                        </div>
                        : null
                }

                {
                    this.props.history.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.history.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({history}) => ({history}))(Index);
