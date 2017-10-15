export default {
    namespace: 'key4',

    state: {
        description: '力量之钥',
        key_id: 'aa7a17e47bb54a15b1e4a0e16ab66a63',
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
        is_record: false,
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
