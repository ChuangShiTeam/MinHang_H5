export default {
    // host: 'http://localhost:8080',
    is_test: true,
    host: 'http://api.chuangshi.nowui.com',
    // is_test: false,
    platform: 'H5',
    version: '9.9.8',
    name: '星创会',
    h5Host: 'http://h5.xingxiao.nowui.com/?#/',
    app_id: 'c1af3f1ae00e4e0da9b20f5bd41b4279',
    wechat_app_id: 'wx26c8db6f1987e4e0',
    index: 'index',
    menu: [{
        key: 'index',
        title: '寻找',
        url: '/index',
        path: '/index',
        icon: 'search.svg',
        selected_icon: 'search_active.svg'
    }, {
        key: 'article',
        title: '党建',
        url: '/article/index',
        path: '/article/index',
        icon: 'favor.svg',
        selected_icon: 'favor_active.svg'
    }, {
        key: 'my',
        title: '个人',
        url: '/my',
        path: '/my',
        icon: 'my.svg',
        selected_icon: 'my_active.svg'
    }]
};