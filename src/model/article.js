export default {
    namespace: 'article',

    state: {
        is_load: false,
        list: [{
            id: 0,
            name: '激情之匙'
        }, {
            id: 1,
            name: '信息之匙'
        }, {
            id: 2,
            name: '力量之匙'
        }, {
            id: 3,
            name: '智慧之匙'
        }, {
            id: 4,
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
