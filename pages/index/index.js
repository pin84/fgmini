let tokenAndLink = require('../../behaviors/tokenAndLink');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        __img: app.$img.home,
        showPage: false, // 是否显示页面
        swiperDot: 0, // 轮播图索引
        bannerInfos: app.$mock.home.bannerInfos || [], // 轮播图
        iconInfos: app.$mock.home.iconInfos || [], // 功能区
        designerInfos: app.$mock.home.designerInfos || [], // 设计师列表
        articleInfos: app.$mock.article || [], // 文章列表
    },
    // behaviors
    behaviors: [tokenAndLink],
    // 轮播图改变
    changeSwiper(e) {
        let upkey = e.currentTarget.dataset.key || "swiperDot";
        this.data[upkey] !== e.detail.current && this.setData({
            [upkey]: e.detail.current
        });
    },
    // 页面点击事件
    pageClick(e) {
        // if (!this.mixin_checkToken()) return false;
        let target = e.currentTarget.dataset;
        switch (target.type) {
            case "swiper": // 轮播图
                this.mixin_handleLink({
                    type: target.item.linkType, 
                    url: target.item.linkAddress,
                });
                break;
            case "nav": // 功能区点击
                console.log(target);
                break;
            case "designer": // 设计师点击
                console.log(target);
                break;
            case "article": // 文章点击
                wx.navigateTo({
                    url: '/pages/articleDetail/articleDetail',
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        acceptDataFromOpenedPage: function (data) {
                            console.log(data)
                        },
                        someEvent: function (data) {
                            console.log(data)
                        }
                    },
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', {article: target.item});
                    }
                })
                break;
            default:
                console.warn("未定义事件", e);
                break;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        setTimeout(() => {
            this.setData({
                showPage: true
            });
        }, 500);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})