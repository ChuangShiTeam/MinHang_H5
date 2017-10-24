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
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的激情之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.poster_picture.file_path?
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            自拍了一张笑脸
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        <img src={"http://api.chuangshi.nowui.com" + this.props.history.poster_picture.file_path} alt=""/>
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的团队之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WingBlank size="md">
                            <div className="history-image">
                                <div className="history-image-tip">
                                    未激活
                                </div>
                            </div>
                        </WingBlank>
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的信念之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.party_history_record.file_path && this.props.history.party_song_record.file_path && this.props.history.hand_print_picture.file_path?
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            朗读了一段党史
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        <div className="history-image-tip">
                                            <audio src={"http://api.chuangshi.nowui.com" + this.props.history.party_history_record.file_path} controls="controls"></audio>
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        <div className="history-image-tip">
                                            歌唱了一首党歌
                                        </div>
                                        <div className="history-image-tip">
                                            <audio src={"http://api.chuangshi.nowui.com" + this.props.history.party_song_record.file_path} controls="controls"></audio>
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        <div className="history-image-tip">
                                            手印
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        <img src={"http://api.chuangshi.nowui.com" + this.props.history.hand_print_picture.file_path} alt=""/>
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的信息之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.location_question.length > 0 && this.props.history.info_question.question ?
                                <WingBlank size="md">
                                    <div className="history-question">
                                        <div className="history-question-title">
                                            标注了位置信息
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        {
                                            this.props.history.location_question.length > 0 ? this.props.history.location_question.map((location, index) =>
                                                <div key={index}>
                                                    <div className="history-answer">
                                                        {location.question.question_title}: {location.member_answer}
                                                    </div>
                                                    <WhiteSpace size="xl"/>
                                                </div>
                                            )
                                                :
                                                null

                                        }

                                        <div className="history-question-title">
                                            回答了一道问题
                                        </div>
                                        <WhiteSpace size="xl"/>
                                        {
                                            this.props.history.info_question.question?
                                                <div>
                                                    <div className="history-answer">
                                                        {this.props.history.info_question.question.question_title}
                                                    </div>
                                                    <WhiteSpace size="xl"/>
                                                    <div className="history-answer">
                                                        答案：{this.props.history.info_question.member_answer}
                                                    </div>
                                                </div>
                                                :
                                                null

                                        }
                                    </div>
                                </WingBlank>
                                :
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }

                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的力量之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.timeline_event_question.length > 0 ?
                                <WingBlank size="md">
                            <div className="history-question">
                                <div className="history-question-title">
                                    回答了两道问题
                                </div>
                                <WhiteSpace size="xl"/>
                                {
                                    this.props.history.timeline_event_question.map((timeline_event, index) =>
                                        <div key={index}>
                                            <div className="history-answer">
                                                {timeline_event.question.question_title}
                                            </div>
                                            <WhiteSpace size="xl"/>
                                            <div className="history-answer">
                                                答案：{timeline_event.member_answer}
                                            </div>
                                            <WhiteSpace size="xl"/>
                                            <WhiteSpace size="xl"/>
                                        </div>
                                    )

                                }
                            </div>
                        </WingBlank>
                                :
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
                                            未激活
                                        </div>
                                    </div>
                                </WingBlank>
                        }
                    </div>
                    <div style={{width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}}>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <h2 className="history-title">
                            我的智慧之钥
                        </h2>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        <WhiteSpace size="lg"/>
                        {
                            this.props.history.video_question.length > 0 ?
                                <WingBlank size="md">
                            <div className="history-question">
                                <div className="history-question-title">
                                    回答了两道问题
                                </div>
                                <WhiteSpace size="xl"/>
                                {
                                    this.props.history.video_question.map((video, index) =>
                                        <div key={index}>
                                            <div className="history-answer">
                                                {video.question.question_title}
                                            </div>
                                            <WhiteSpace size="xl"/>
                                            <div className="history-answer">
                                                答案：{video.member_answer}
                                            </div>
                                            <WhiteSpace size="xl"/>
                                            <WhiteSpace size="xl"/>
                                        </div>
                                    )

                                }
                            </div>
                        </WingBlank>
                                :
                                <WingBlank size="md">
                                    <div className="history-image">
                                        <div className="history-image-tip">
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
