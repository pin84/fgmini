const auth = {
    /**
     * 登录[受2021.04.13 wx.getUserInfo API 影响，新版本不建议使用，请使用newLogin]
     * @return {Object} code, iv, encryptedData
     */
    login_old() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (loginRes) => {
                    let code = loginRes.code
                    wx.getUserInfo({
                        success: (infoRes) => {
                            let iv = infoRes.iv
                            let encryptedData = infoRes.encryptedData
                            resolve({code, iv, encryptedData})
                        },
                        fail: (infoError) => {
                            reject(infoError)
                        }
                    })
                },
                fail: (loginError) => {
                    reject(loginError)
                }
            })
        })
    },
    /**
     * 登录[受2021.04.13 wx.getUserInfo API 影响，新版本使用]
     * 因《接口调用频率规范》限制，注意请勿频繁调用 https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     * @return {Object} code, iv, encryptedData, userInfo
     */
    login(e = {}) {
        return Promise.all([this.getCode(), this.getUserProfile(e.desc)])
            .then(res => {
                let [code, info] = res
                return {code, ...info}
            }).catch(err => {
                console.warn(err)
                return {}
            })
    },
    /**
     * 检查登录态是否过期
     * 因《接口调用频率规范》限制，注意请勿频繁调用 https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     * @return {Boolean} true => session_key 未过期,并且在本生命周期一直有效; false => session_key 已经失效，需要重新执行登录流程
     */
    checkSession() {
        return new Promise((resolve, reject) => {
          wx.checkSession({
            success() {
              resolve(true)
            },
            fail() {
              resolve(false)
            }
          })
        })
    },
    /**
     * 获取CODE[wx.login => code 解密可获取openid、session_key、unionid，unionid需满足条件]
     * 因《接口调用频率规范》限制，注意请勿频繁调用 https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     * @return {String} wx.login => code
     */
    getCode() {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    resolve(res.code)
                },
                fail(error) {
                    wx.showToast({
                        title: '获取code失败',
                        icon: 'none'
                    })
                    reject(error)
                }
            })
        })
    },
    /**
     * 获取用户信息[受2021.04.13 wx.getUserInfo API 影响，新版本不建议使用，请使用wx.getUserProfile]
     * 因《接口调用频率规范》限制，注意请勿频繁调用 https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     * @return {Object} wx.getUserInfo() => {}
     */
    getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    },
    /**
     * 用户信息授权
     * 因《接口调用频率规范》限制，注意请勿频繁调用 https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
     * @param {String} msg 传入getUserProfile用于desc
     * @returns {Object} iv, encryptedData, userInfo
     */
    getUserProfile(msg = "用于完善会员资料") {
        return new Promise((resolve, reject) => {
            wx.getUserProfile({
                lang: "zh_CN",
                desc: msg,
                success: function (res) {
                    if (res.errMsg === "getUserProfile:ok") {
                        let { iv, encryptedData, userInfo } = res
                        resolve({ iv, encryptedData, userInfo })
                    } else {
                        reject(res.errMsg)
                    }
                },
                fail: function (fail) {
                    reject(fail)
                }
            })
        })
    },
    /**
     * 检查用户权限
     * @param {String} scope 传入需要检查的权限名称，详情参考https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/AuthSetting.html
     * @returns Object
     */
    checkAuthorize(scope) {
        return new Promise((resolve, reject) => {
            // 获取缓存的权限信息
            let userSetting = wx.getStorageSync('_authSetting_');
            if (userSetting.authSetting) {
                handleAuthSetting(userSetting);
            } else {
                wx.getSetting({
                    success(res) {
                        // 更新缓存的权限信息
                        wx.setStorageSync('_authSetting_', res);
                        handleAuthSetting(res)
                    },
                    fail(error) {
                        console.warn(error)
                        reject(error)
                    }
                });
            };
            // 处理权限信息
            function handleAuthSetting(res) {
                if (!res.authSetting[scope]) {
                    resolve({
                        hasScope: false,
                        setting: res
                    })
                } else {
                    resolve({
                        hasScope: true,
                        setting: res
                    }) 
                }
            };
        })  
    },
    /**
     * 打开授权
     * @param {String} scope 传入需要检查的权限名称，详情参考https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/AuthSetting.html
     * @returns Object
     */
    authorize(scope) {
        let that = this;
        return new Promise((resolve, reject) => {
            // 获取缓存的权限信息
            let userSetting = wx.getStorageSync('_authSetting_');
            wx.authorize({
                scope: scope,
                success() {
                    // 更新缓存的权限信息
                    userSetting.authSetting[scope] = true;
                    wx.setStorageSync('_authSetting_', userSetting);
                    resolve({
                        hasScope: true
                    })
                },
                fail() {
                    wx.showModal({
                        title: '提示',
                        content: '使用该功能需要获得您的授权',
                        showCancel: true,
                        confirmText: '立即授权',
                        confirmColor: "#3E8E8B",
                        success(modalRes) { 
                            if (modalRes.confirm) {
                                that.openSetting(scope).then(res => {
                                    resolve(res)
                                })
                            } else if (modalRes.cancel) {
                                userSetting.authSetting[scope] = false;
                                wx.setStorageSync('_authSetting_', userSetting);
                                resolve({
                                    hasScope: false
                                })
                            }
                        }
                    })
                }
            })
        })
    },
    /**
     * 打开设置
     * @param {String} scope 传入需要检查的权限名称，详情参考https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/AuthSetting.html
     * @returns Boolean || Object
     */
    openSetting(scope) {
        return new Promise((resolve, reject) => {
            // 获取缓存的权限信息
            let userSetting = wx.getStorageSync('_authSetting_');
            wx.openSetting({
                success(res) {
                    // 更新缓存的权限信息
                    userSetting.authSetting = {...userSetting.authSetting, ...res.authSetting};
                    wx.setStorageSync('_authSetting_', userSetting);
                    !res.authSetting && console.info(res)
                    resolve({
                        hasScope: !!res.authSetting[scope],
                        setting: res
                    });
                },
                fail(e) {
                    console.warn(e);
                    reject(false)
                }
            })
        })
    }
}


module.exports = auth