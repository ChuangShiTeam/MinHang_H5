import React, {Component} from "react";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import {ActivityIndicator, WhiteSpace, List} from 'antd-mobile';
import http from "../util/http";
import storage from "../util/storage";

class My extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: this.props.my.is_load
        }
    }

    componentDidMount() {
        document.title = '个人中心';

        document.body.scrollTop = 0;

        this.props.dispatch({
            type: 'my/fetch',
            data: {
                is_load: true
            }
        });
    }

    componentWillUnmount() {

    }

    render() {
        const Item = List.Item;
        const Brief = Item.Brief;

        return (
            <div>
                <List>
                    <Item
                        arrow="horizontal"
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        multipleLine
                        onClick={() => {}}
                    >
                        Title <Brief>subtitle</Brief>
                    </Item>
                </List>
                {
                    this.props.my.is_load ?
                        ''
                        :
                        <div className={'loading-mask ' + (this.props.my.is_load ? 'loading-mask-hide' : '')}>
                            <div className="loading"><ActivityIndicator/></div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(({my}) => ({my}))(My);
