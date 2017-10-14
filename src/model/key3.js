export default {
    namespace: 'key3',

    state: {
        description: '信息之匙',
        key_id: '6d1fad4843c94a6bb5131a48b9f38e37',
        is_load: false,
        key: {},
        member_key: {},
        step: 0,
        task_id: '',
        task: null,
        member_task: null,
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
