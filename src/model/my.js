export default {
    namespace: 'my',

    state: {
        is_load: false,
        user_name: '',
        user_avatar: '',
        history_list: [],
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
