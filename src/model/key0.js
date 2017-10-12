export default {
    namespace: 'key0',

    state: {
        is_load: false,
        step: 0,
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
