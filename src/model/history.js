export default {
    namespace: 'history',

    state: {
        is_load: false,
        history: [],
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
