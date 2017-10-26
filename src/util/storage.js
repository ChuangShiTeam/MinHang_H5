import constant from './constant';

const open_id_key = 'open_id_' + constant.version;
const token_key = 'token_' + constant.version;

function getOpenId() {
    if (constant.is_test) {
        return 'o1CDrwvip3W_WjC9hmXfmQoAa12A';
    }
    return localStorage.getItem(open_id_key);
}

function setOpenId(open_id) {
    localStorage.setItem(open_id_key, open_id);
}

function getToken() {
    let token = localStorage.getItem(token_key);

    if (constant.is_test) {
        //token = 'l0BNycgZiMCRb4OXFFtdKR8n6ipjDATuQ/82R+p5vewwDPpsrkJ0kshtjpJbNC/fklIFWJyfVktPh0c+++f0FYZz7hrFwDQGeyxzDBKWW2w=';

        token = 'LfgjlSw5wOycQwpcVDMjOoYz//yozWUBAORcSu0fMPnOQOfnLAaY2XRto8tiHoAbwxIYaxQCkC+nRhKwUTrkw+G//BHO2b6CIcC1A32vlWE=';

    }

    if (token == null) {
        return '';
    } else {
        return token;
    }
}

function setToken(token) {
    localStorage.clear();

    localStorage.setItem(token_key, token);
}

export default {
    getOpenId: getOpenId,
    setOpenId: setOpenId,
    getToken: getToken,
    setToken: setToken
};
