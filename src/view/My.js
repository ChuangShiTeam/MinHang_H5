import React, {Component} from "react";
import {connect} from "dva";
import {routerRedux} from "dva/router";
import {ActivityIndicator, WhiteSpace, List} from 'antd-mobile';
import http from "../util/http";
import storage from "../util/storage";

class My extends Component {
    constructor(props) {
        super(props);

        this.state = {}
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
                        thumb={<img src={require('../assets/image/banner.jpg')} style={{width: '100px',  height: '100px'}} alt=""/>}
                        multipleLine
                        onClick={() => {}}
                    >
                        user name
                    </Item>
                </List>

                <WhiteSpace size="lg"/>
                <List>
                    <Item
                        thumb={require('../assets/svg/search.svg')} arrow="horizontal"
                    >
                        我的钥匙
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
