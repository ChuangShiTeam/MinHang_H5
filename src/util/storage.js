import constant from './constant';

const open_id_key = 'open_id_' + constant.version;
const token_key = 'token_' + constant.version;

function getOpenId() {
    if (constant.is_test) {
        if (constant.app_id === 'c1af3f1ae00e4e0da9b20f5bd41b4279') {
            return 'oqvzXv4c-FY2-cGh9U-RA4JIrZoc';
        } else {
            return 'oXxTjwoBVyBquUAAx3RaFow62zjA';
        }
    }
    return localStorage.getItem(open_id_key);
}

function setOpenId(open_id) {
    localStorage.setItem(open_id_key, open_id);
}

function getToken() {
    let token = localStorage.getItem(token_key);

    if (constant.is_test) {
        token = 'O7PGCdUoZYAm62TrVkP2xlBId5G44Oeb8ZjYH9J/t+fe4lCkP8E3cEfHOhKW6sxTklIFWJyfVktPh0c+++f0FYMeXy+vVx2yDSLpuUZ+mKQ=';
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
