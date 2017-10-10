import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

import {ActivityIndicator, WhiteSpace, Carousel, List} from 'antd-mobile';

import constant from '../../util/constant';
import http from '../../util/http';

class ArticleIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        document.title = '党建';

        document.body.scrollTop = 0;

        this.props.dispatch({
            type: 'article/fetch',
            data: {
                is_load: true
            }
        });
    }

    componentWillUnmount() {

    }

    handleArticle(article_id) {
        this.props.dispatch(routerRedux.push({
            pathname: '/article/detail/' + article_id,
            query: {},
        }));
    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;

        return (
            <div>
                {
                    this.props.article.list.length > 0 ?
                        <div style={{height: document.documentElement.clientWidth * 0.48 + 'px'}}>
                            <Carousel autoplay infinite>
                                {
                                    this.props.article.list.map((item, index) => {
                                        return (
                                            <img key={index} src={require('../../assets/image/banner.jpg')}
                                                 style={{width: document.documentElement.clientWidth, height: document.documentElement.clientWidth * 0.48 + 'px'}}
                                                 alt=""/>
                                        );
                                    })
                                }
                            </Carousel>
                        </div>
                        :
                        ''
                }
                {
                    this.props.article.list.length > 0 ?
                        <List>
                            {
                                this.props.article.list.map((item) => {
                                    return (
                                        <Item
                                            arrow="horizontal"
                                            thumb={<img src={require('../../assets/image/banner.jpg')} style={{width: '200px',  height: '96px'}} alt=""/>}
                                            multipleLine
                                            onClick={this.handleArticle.bind(this, item.article_id)}
                                        >
                                            Title <Brief>subtitle</Brief>
                                        </Item>
                                    );
                                })
                            }
                        </List>
                        :
                        ''
                }
                {
                    this.props.article.is_load && this.props.article.length === 0 ?
                        <div>
                            <img src={require('../../assets/svg/empty.svg')} className="empty-image" alt=""/>
                            <div className="empty-text">没有数据</div>
                        </div>
                        :
                        ''
                }
                {
                    this.props.article.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.article.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({article}) => ({article}))(ArticleIndex);
