// pages/mykt_more_feedback/mykt_more_feedback3.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    add: function () {                   //添加公告
        var that = this
        if (this.data.data == '') {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.request({
                url: wx.getStorageSync('url') + 'feedback/creat',
                data: {
                    classid: wx.getStorageSync('classid'),
                    data: this.data.data,
                    openid: wx.getStorageSync('user_data').openid
                },
                success: res => {
                    if (res.data == 'success') {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            })
        }

    },
    input: function (e) {
        this.setData({
            data: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})