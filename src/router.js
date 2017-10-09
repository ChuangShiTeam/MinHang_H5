import React from 'react';
import {Router, Route, IndexRedirect} from 'dva/router';
import Main from './view/Main';
import Index from './view/Index';
import Key0 from './view/key0/Index';
import ArticleIndex from './view/article/ArticleIndex';
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
                    <Route path="/my" component={My}/>
                </Route>
                <Route path="/key/0" component={Key0}/>
            </Route>
        </Router>
    );
}

export default RouterConfig;
