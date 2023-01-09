// pages/joinkt/joinkt.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        yqmvalue: "12nkb",
        msg: "",
        url: "",
        classdata: [],
        userdata: [],
    },

    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: 'url',
            success: function (res) {
                that.data.url = res.data
            }
        })
        wx.getStorage({
            key: 'user_data',
            success: function (res) {
                that.data.userdata = res.data
            }
        })
    },

    qrcode: function () { //扫码
        wx.scanCode({
            success: (res) => {
                if (res.result.length == 5) {
                    wx.showToast({
                        title: '扫描成功',
                        icon: 'none',
                        duration: 2000
                    })
                    this.setData({
                        yqmvalue: res.result,
                    })
                    var that = this;
                    that.loaddata();
                }
                else {
                    wx.showToast({
                        title: '请扫描正确的二维码',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: (res) => {
                wx.showToast({
                    title: '扫描失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    next: function () {
        if (this.data.yqmvalue.length == 5) {
            var that = this;
            that.loaddata();

        }
        else {
            wx.showToast({
                title: '请输入正确的邀请码',
                icon: 'none',
                duration: 2000
            })
        }


    },
    back: function () {
        this.setData({
            page: 1
        })
    },

    input: function (e) {
        this.setData({
            yqmvalue: e.detail.value
        })
    },

    loaddata: function () {   //从后端获取信息
        wx.request({
            url: this.data.url + "joinadd/find/",
            data: {
                yqm: this.data.yqmvalue,
                openid: this.data.userdata["openid"]
            },
            success: (res) => {
                if (res.data == "error") {
                    wx.showToast({
                        title: '邀请码错误或已加入课堂',
                        icon: 'none',
                        duration: 2000
                    })
                }
                else {
                    this.setData({
                        classdata: res.data["classclassdata"],
                        msg: "开课教师: " + res.data["creator"] + "\n课堂名称: " + res.data["classname"],
                        page: 2
                    })
                }

            },
            fail: (res) => {
                wx.showToast({
                    title: '请求失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    join: function (e) {
        var that = this;
        var classclassid = e.currentTarget.dataset.class_class_id
        wx.request({
            url: this.data.url + "joinadd/join/",
            data: {
                classclassid: classclassid,
                openid: that.data.userdata["openid"]
            },
            success: (res) => {
                if (res.data == "success") {
                    wx.showToast({
                        title: '加入成功',
                        icon: 'none',
                        duration: 2000
                    })
                    wx.reLaunch({
                        url: '/pages/zjm/zjm',
                    })
                }
                else {
                    wx.showToast({
                        title: '加入失败',
                        icon: 'none',
                        duration: 2000
                    })

                }
            }

        })
    }
})