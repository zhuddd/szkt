// pages/xzsf/xzsf.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userdata: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: "user_data",
            success: function (res) {
                that.setData({
                    userdata: res.data
                })
            }
        })
    },

    stu: function () { //跳转
        this.data.userdata.is_teacher = 'false'
        wx.setStorage({
            key: "user_data",
            data: this.data.userdata,

        })
        wx.navigateTo({
            url: '../sfxt/sftx',
        })
    },



    tea: function () { //跳转
        this.data.userdata.is_teacher = 'true'
        wx.setStorage({
            key: "user_data",
            data: this.data.userdata,
        })
        wx.navigateTo({
            url: '../sfxt/sftx',
        })
    }


})