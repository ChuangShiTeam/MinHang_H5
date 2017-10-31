import React, {Component} from 'react';
import {connect} from 'dva';
import {ActivityIndicator, WhiteSpace} from 'antd-mobile';

import http from '../../util/http';
import validate from '../../util/validate';

class ArticleDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            article: {},
        };
    }

    componentDidMount() {
        document.body.scrollTop = 0;
        this.handleLoad();
    }

    componentWillUnmount() {

    }

    handleLoad() {
        http.request({
            url: '/mobile/article/find',
            data: {
                article_id: this.props.params.article_id
            },
            success: function (data) {
                document.title = data.article_name;

                data.article_content = validate.unescapeHtml(data.article_content);

                this.setState({
                    article: data
                });

            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: true
                });
            }.bind(this)
        });
    }

    render() {
        return (
            <div>
                <div>
                    <div style={{textAlign: 'center'}}><h1>{this.state.article.article_name}</h1></div>
                    <div className="article-content"
                         dangerouslySetInnerHTML={{__html: this.state.article.article_content}}></div>
                </div>
                <WhiteSpace size="lg"/>
                <div style={{height: '100px'}}></div>
                {
                    this.state.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.state.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({}) => ({}))(ArticleDetail);
