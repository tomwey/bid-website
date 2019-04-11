export function MobileCheck(rule, value, callback) {
    // console.log(rule);
    if (!value) {
        callback();
    } else {
        var reg = new RegExp(/^1[3456789]\d{9}$/);
        if (!reg.test(value)) {
            callback(new Error('手机号不正确'));
        } else {
            callback();
        }
    }
}

export function IDCardCheck(rule, value, callback) {
    // console.log(rule);
    if (!value) {
        callback();
    } else {
        var reg = new RegExp(/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/);
        if (!reg.test(value)) {
            callback(new Error('身份证号不正确'));
        } else {
            callback();
        }
    }
}