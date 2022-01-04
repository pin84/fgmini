const warn = console.warn

const info = {
    /**
     * 检查是否有可更新版本
     */
    version() {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                warn('新版本?', res.hasUpdate)
            })
            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，需要重启应用',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })
            updateManager.onUpdateFailed(function () {
                // 新版本下载失败
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                    showCancel: false
                })
            })
        }
    },
    /**
     * 设备信息
     */
    systemInfo() {
        let o = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
        return o;
    },
    /**
     * 获取当前帐号信息
     */
    accountInfo() {
        const info = wx.getAccountInfoSync ? wx.getAccountInfoSync() : {};
        return info.miniProgram || {}
    },
    /**
     * navbar相关数据
     */
    navbar() {
        let systemInfo = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {}
        let buttonInfo = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : {}

        // 导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)

        // 该innerHeight有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
        // let innerHeight = buttonInfo.height + (buttonInfo.top - systemInfo.statusBarHeight) * 2;

        let innerHeight = systemInfo.platform == 'ios' ? 44 : 48

        let innerPaddingLeft = systemInfo.windowWidth - buttonInfo.right
        let innerPaddingRight = systemInfo.windowWidth - buttonInfo.left
        let innerLeft = buttonInfo.right - buttonInfo.left
        let innerContent = systemInfo.windowWidth - innerLeft - innerPaddingRight - innerPaddingLeft

        let tpage = getCurrentPages() // 获取页面数据(判断是否显示返回上一页)

        return {
            systemInfo, // 系统信息
            buttonInfo, // 按钮信息
            innerHeight, // 标题栏高度设置
            innerPaddingRight, // 标题栏右侧功能区距离最右边的宽度
            innerPaddingLeft, // 标题栏左侧功能区距离最左边的宽度
            innerLeft, // 标题栏左侧功能区宽度
            innerContent, // 标题宽度
            showBack: tpage.length > 1, // 是否显示返回上一页按钮
        }
    },
    /**
     * 基础版本库比较
     * @param {String} v2 需要的兼容的最低基础版本库 
     * @return {[0, 1, -1]} 0：相等 1：当前版本大于需要兼容版本 -1：当前版本小于需要兼容版本
     */
    basicVersion(v2) {
        let v1 = wx.getSystemInfoSync ? wx.getSystemInfoSync().SDKVersion : '1.1.0'
        return this.checkVersion(v1, v2)
    },
    /**
     * 比较版本
     * @param {*} v1 获取的客户端的版本
     * @param {*} v2 需要的兼容的最低版本
     */
    checkVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }
        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
        return 0
    }
}


module.exports = info