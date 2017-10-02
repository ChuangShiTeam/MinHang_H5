export default {
    namespace: 'my',

    state: {
        is_load: false,
        list: [],
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
