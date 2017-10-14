export default {
    namespace: 'key2',

    state: {
        description: '信念之匙',
        key_id: '7a3995d91c9d41d5a946a990a53e45bb',
        is_load: false,
        key: {},
        member_key: {},
        selectedIndex: 0,
        step1: 0,
        step2: 0,
        task_id: '',
        task: null,
        member_task_list: [],
        key_is_activated: false,
        file: null,
        secene_id: '',
        action: '',
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
