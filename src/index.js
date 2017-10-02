import dva from 'dva';
import Router from './router';
import {useRouterHistory} from 'dva/router';
import {createHashHistory} from 'history';
import FastClick from 'fastclick';

import './view/Style.css';

import index from './model/index';
import article from './model/article';
import my from './model/my';

import wechat from './util/wechat';

let result = true;

if (document.location.href.indexOf('/story/') > -1 || document.location.href.indexOf('/science/') > -1) {

} else {
    result = wechat.auth();
}

if (result) {

    FastClick.attach(document.body);

    const app = dva({
        history: useRouterHistory(createHashHistory)({queryKey: false}),
    });

    app.model(index);
    app.model(article);
    app.model(my);

    app.router(Router);

    document.getElementById("loading").remove();

    app.start('#root');
}