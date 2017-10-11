import dva from 'dva';
import Router from './router';
import {useRouterHistory} from 'dva/router';
import {createHashHistory} from 'history';
import io from 'socket.io-client';
import FastClick from 'fastclick';

import './view/Style.css';

import index from './model/index';
import article from './model/article';
import my from './model/my';
import key0 from './model/key0';

import constant from './util/constant';
import notification from './util/notification';
import wechat from './util/wechat';

let result = true;

if (document.location.href.indexOf('/story/') > -1 || document.location.href.indexOf('/science/') > -1) {

} else {
    result = wechat.auth();
}

if (result) {
    window.socket = io(constant.socket);

    window.socket.on('connect', function () {
        window.socket.emit('login', {
            id: 8
        }, function (response) {
            if (response.code === 200) {
                window.socket.on('receiveMessage', function (data) {
                    notification.emit('event', {});
                });

                window.socket.emit('sendMessage', {
                    targetId: 0,
                    action: 'event',
                    content: '123456'
                }, function (response) {

                });
            }
        });
    });

    FastClick.attach(document.body);

    const app = dva({
        history: useRouterHistory(createHashHistory)({queryKey: false}),
    });

    app.model(index);
    app.model(article);
    app.model(my);
    app.model(key0);

    app.router(Router);

    document.getElementById("loading").remove();

    app.start('#root');
}