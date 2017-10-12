export default {
    namespace: 'index',

    state: {
        is_load: false,
        list: [],
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};
