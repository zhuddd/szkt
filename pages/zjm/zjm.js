// pages/zjm/zjm.js
const app = getApp();
const wsk = app.globalData.wsk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userdata: '',
        classdata: [],
        classdata_a: [],
        classdata_b: [],
        

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.getdata()
        getApp().watch('msg',this.watchBack);
        wx.sendSocketMessage({
            data: '{"type":"setclass","openid":"' + wx.getStorageSync('user_data').openid + '"}',
        })
    },
    watchBack: function (name,value) {
        console.log(value);
     }
    ,
    getdata() {
        var that = this
        wx.getStorage({
            key: "user_data",
            success: function (id) {
                if (typeof (id.data.openid) == "undefined") {
                    wx.reLaunch({
                        url: '../dl/dl',
                    })
                } else {
                    var url = wx.getStorageSync('url')
                    wx.request({
                        url: url + 'login/getdata/',
                        data: {
                            openid: id.data.openid
                        },
                        success: function (res) {
                            if (res.data == 'error') {
                                wx.reLaunch({
                                    url: '../dl/dl',
                                })
                            } else if (res.data.older == 'False') {
                                wx.reLaunch({
                                    url: '../dl/dl',
                                })
                            } else {
                                that.setData({
                                    userdata: res.data
                                })
                                wx.setStorage({
                                    key: "user_data",
                                    data: res.data,
                                })
                                that.getkt()
                               
                            }
                        }
                    })
                }

            },
            fail: function (res) {
                wx.reLaunch({
                    url: '../dl/dl',
                })
            }
        })
    },
    getkt: function (e) {
        var that = this
        wx.getStorage({
            key: "url",
            success: function (res) {
                wx.request({
                    url: res.data + 'joinadd/getkt',
                    data: {
                        openid: that.data.userdata["openid"]
                    },
                    success: function (res) {
                        that.setData({
                            classdata: res.data
                        })
                        wx.setStorageSync('classdata', res.data)
                        that.breakdata()
                    }
                })
            }
        })
    },
    breakdata: function (e) {
        var that = this
        var classdata = that.data.classdata
        var classdata_a = []
        var classdata_b = []
        for (var i = 0; i < classdata.length; i++) {
            if (classdata[i]["classlevel"] == "1") {
                classdata_a.push(classdata[i])
            } else {
                classdata_b.push(classdata[i])
            }
        }
        that.setData({
            classdata_a: classdata_a,
            classdata_b: classdata_b,
        })
    },
    addkt: function (e) {
        wx.navigateTo({
            url: '../addkt/addkt',
        })
    },
    joinkt: function (e) {
        wx.navigateTo({
            url: '../joinkt/joinkt',
        })
    },
    classtap: function (e) {
        var classid = e.currentTarget.dataset.classid
        var level = e.currentTarget.dataset.level
        wx.setStorageSync("classid", classid)
        wx.setStorageSync("mylevel", level)
        wx.navigateTo({
            url: '../mykt/mykt',
        })
    },




})
