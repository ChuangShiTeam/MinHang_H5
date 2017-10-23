export default {
    namespace: 'history',

    state: {
        is_load: false,
        poster_picture: {},
        party_history_record: {},
        party_song_record: {},
        hand_print_picture: {},
        location_question: {},
        info_question: {},
        timeline_event_question: [],
        video_question: [],
        selectedIndex: 0,
        count: 0,
        scroll_top: 0
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        },
    },

};
