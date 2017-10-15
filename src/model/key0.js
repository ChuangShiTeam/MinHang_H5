export default {
	namespace: 'key0',

	state: {
		description: '激情之钥',
		key_id: 'f9892bc1d79c46e2a06042a935ac02fb',
		is_load: false,
		key: {},
		member_key: {},
        selectedIndex: 0,
        step: 0,
        task_id: '',
		task: null,
        member_task: null,
		file: null,
		is_record: false,
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
