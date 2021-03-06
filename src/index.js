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
import key2 from './model/key2';
import key3 from './model/key3';
import key4 from './model/key4';
import key5 from './model/key5';
import history from './model/history';

import constant from './util/constant';
import notification from './util/notification';
import wechat from './util/wechat';
import storage from './util/storage';

let result = wechat.auth();

if (result) {
    window.socket = io(constant.socket);

    window.socket.on('connect', function () {
        window.socket.emit('login', {
            id: storage.getToken()
        }, function (response) {
            if (response.code === 200) {
                window.socket.on('receiveMessage', function (data) {
                    notification.emit('receiveMessage', {});
                });
                notification.on('sendMessage', this, function (data) {
                    window.socket.emit('sendMessage', {
                        targetId: data.targetId,
                        action: data.action,
                        content: data.content
                    }, function (response) {

                    });
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
    app.model(key2);
    app.model(key3);
    app.model(key4);
    app.model(key5);
    app.model(history);

    app.router(Router);

    document.getElementById("loading").remove();

    app.start('#root');
}