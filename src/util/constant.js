export default {
    // socket: 'http://localhost:2998',
    socket: 'http://api.chuangshi.nowui.com:2998',
    // host: 'http://localhost:8080',
    // is_test: true,
    host: 'http://api.chuangshi.nowui.com',
    is_test: false,
    platform: 'H5',
    version: '1.0.0',
    name: '闵行党建',
    h5Host: 'http://h5.minhang.nowui.com/?#/',
    app_id: '8acc2d49ad014f418878d1a16336c16b',
    wechat_app_id: 'wxb4b0bdb35f145759',
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