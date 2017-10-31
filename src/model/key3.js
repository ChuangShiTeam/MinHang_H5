export default {
    namespace: 'key3',

    state: {
        description: '信息之钥',
        key_id: '6d1fad4843c94a6bb5131a48b9f38e37',
        is_load: false,
        key: {},
        member_key: {},
        selectedIndex: 0,
        step1: 0,
        step2: 0,
        task_id: '',
        task: null,
        member_task_list: [],
        location_list: [],
        question_id: '',
        question:{},
        is_see_answer: false,
        is_open_map: false,
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
