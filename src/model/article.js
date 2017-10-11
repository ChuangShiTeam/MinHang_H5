export default {
    namespace: 'article',

    state: {
        is_load: false,
        list: [{
            article_id: 0,
            name: '激情之匙'
        }, {
            article_id: 1,
            name: '信息之匙'
        }, {
            article_id: 2,
            name: '力量之匙'
        }, {
            article_id: 3,
            name: '智慧之匙'
        }, {
            article_id: 4,
            name: '团队之匙'
        }],
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
