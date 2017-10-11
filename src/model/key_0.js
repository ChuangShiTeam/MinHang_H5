export default {
	namespace: 'key_0',

	state: {
		description: '激情之匙',
		key_id: 'f9892bc1d79c46e2a06042a935ac02fb',
		is_load: false,
		list: [],
		scroll_top: 0
	},

	reducers: {
		fetch(state, action) {
			return {...state, ...action.data};
		},
	},

};
