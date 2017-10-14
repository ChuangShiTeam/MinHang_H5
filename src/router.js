import React from 'react';
import {Router, Route, IndexRedirect} from 'dva/router';
import Main from './view/Main';
import Index from './view/Index';
import Key0 from './view/key0/Index';
import Key2 from './view/key2/Index';
import Key3 from './view/key3/Index';
import Key4 from './view/key4/Index';
import Key5 from './view/key5/Index';
import ArticleIndex from './view/article/ArticleIndex';
import ArticleDetail from './view/article/ArticleDetail';
import My from './view/My';

import constant from './util/constant';
import notification from './util/notification';

function RouterConfig({history}) {

    const handleEnter = function (next, replace, callback) {
        callback();
    };

    const handleChange = function (next, replace, callback) {
        notification.emit('notification_main_load', {
            path: replace.location.pathname
        });

        callback();
    };

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route component={Main} onEnter={handleEnter} onChange={handleChange}>
                    <Route path="/index" component={Index}/>
                    <Route path="/article/index" component={ArticleIndex}/>
                    <Route path="/article/detail/:article_id" component={ArticleDetail}/>
                    <Route path="/my" component={My}/>
                </Route>
                <Route path="/key/f9892bc1d79c46e2a06042a935ac02fb" component={Key0}/>
                <Route path="/key/7a3995d91c9d41d5a946a990a53e45bb" component={Key2}/>
                <Route path="/key/6d1fad4843c94a6bb5131a48b9f38e37" component={Key3}/>
                <Route path="/key/aa7a17e47bb54a15b1e4a0e16ab66a63" component={Key4}/>
                <Route path="/key/0fef53b2ce614711a9235e05ccbd5dbc" component={Key5}/>
            </Route>
        </Router>
    );
}

export default RouterConfig;
