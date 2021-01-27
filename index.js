import ipc from './IPC'
import jsUtil from './jsUntil'

exports.sum = function () {
    let res = 0;
    for (let i = 0; i < arguments.length; i++) {
        res += arguments[i];
    }
    return res;
}
exports.ipc = ipc
exports.jsUtil=jsUtil