/**
 * 挂载
 * @param {Object} MOUNTOBJECT 挂载的对象
 * @param {String} MOUNTKEY 挂载的key
 * @param {Function} MOUNTFN get方法
 */
const mount = (MOUNTOBJECT, MOUNTKEY, MOUNTFN) => {
    Object.defineProperty(MOUNTOBJECT, MOUNTKEY, {
        get: MOUNTFN,
    })
};
module.exports = mount;