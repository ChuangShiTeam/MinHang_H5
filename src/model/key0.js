export default {
	namespace: 'key0',

	state: {
		description: '激情之匙',
		key_id: 'f9892bc1d79c46e2a06042a935ac02fb',
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
