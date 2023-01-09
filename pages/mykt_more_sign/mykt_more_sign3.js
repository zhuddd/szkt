// pages/mykt_more_sign/mykt_more_sign3.js
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '',
        now: '',
        starttime: '点击选择',
        timea: '',
        endtime: '点击选择',
        timeb: '',
        set: 1,
        password: '',
        type: 'pt',
        a: '#1EA9FF',
        b: '#9FC1D3',
    },

    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var classid = wx.getStorageSync('classid')
        var date = new Date();
        this.setData({
            date: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        });
        var hour = date.getHours();
        var minute = date.getMinutes() + 1;
        if (minute < 10) {
            minute = '0' + minute;
        }
        var now = hour + ':' + minute;
        this.setData({
            now: now,
            classid: classid
        })

    },
    
    bindTimeChange: function (e) {
        var date = this.data.date
        var starttime = date + ' ' + e.detail.value + ':00'
        var timea = new Date(date + ' ' + e.detail.value + ':00').getTime()
        this.setData({
            starttime: starttime,
            timea: timea,
        })
    },
    bindTimeChange2: function (e) {
        var timeb = '1970/01/01 ' + e.detail.value
        timeb = new Date(timeb).getTime() + 28800000
        var timea = this.data.timea
        this.setData({
            endtime: e.detail.value,
            timeb: timea + timeb,
        })
    },
    getlock: function (e) {
        this.setData({
            password: e.detail.lock
        })
    },
    pt: function (e) {
        this.setData({
            set: 1,
            type: 'pt',
            a: '#1EA9FF',
            b: '#9FC1D3',
        })
    },
    ss: function (e) {
        this.setData({
            set: 2,
            type: 'ss',
            b: '#1EA9FF',
            a: '#9FC1D3',
        })
    },
    next: function (e) {
        if (this.data.set == 2) {
            if (this.data.password.length < 5) {
                wx.showToast({
                    title: '滑动点数不能小于5',
                    icon: 'none',
                    duration: 1000
                })
            } else {
                this.setData({
                    set: this.data.set - 1
                })
            }
        }
        else if (this.data.set == 1) {
            this.updata()
        }
    },

    updata: function () {
        var that = this
        if (this.data.time == '点击选择' || this.data.endtime == '点击选择') {
            wx.showToast({
                title: '请选择时间',
                icon: 'none',
                duration: 2000
            })
        } else {
            var time = util.formatTime(new Date())
            var classid = wx.getStorageSync('classid');
            var signid = Date.now();
            var set = this.data.type
            var password = this.data.password
            var signset = { set: set, password: password, starttime: this.data.timea, endtime: this.data.timeb, end: '0', type: 'qd' };
            wx.request({
                url: wx.getStorageSync('url') + 'signin/signin',
                data: {
                    set: 'creat',
                    classid: classid,
                    signid: signid,
                    signset: signset,
                    time: time
                },
                success: function (res) {
                    if (res.data == 'success') {
                        that.sendmsg()
                        wx.showToast({
                            title: '创建成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        wx.showToast({
                            title: '创建失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })

        }
    },
    sendmsg: function () {                       //发送更新消息
        var that = this;
        wx.sendSocketMessage({
            data: '{"classid":"' +that.data.classid+ '","type":"msg","msg":"sign"}',
        })
    },


})




