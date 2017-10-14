export default {
    namespace: 'key5',

    state: {
        description: '智慧之匙',
        key_id: '0fef53b2ce614711a9235e05ccbd5dbc',
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
