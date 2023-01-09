// pages/xx/xx.js
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oneDayMillions: 24 * 3600 * 1000,
        notadd: [],
        msgdata: [],
        update: false,
        updatenum: 0,
    },

    onShow: function () {
        this.getDaydata()
        this.setData({
            classdata: wx.getStorageSync('classdata')
        })
        this.getmsg();
        getApp().watch('qjmsg', this.watchBack);
    },
    watchBack: function (name, value) {
        this.data.update = true;
        this.getmsg();
    },
    getmsg: function (e) {
        var that = this;
        var msgdata = wx.getStorageSync('msgdata')
        var lastTime = 0
        if (msgdata == '') {
            lastTime = 0
        } else {
            lastTime = msgdata[0].time
        }

        wx.request({
            url: wx.getStorageSync('url') + 'mail/getmsg',
            data: {
                openid: wx.getStorageSync('user_data').openid,
                lastTime: lastTime
            },
            success: function (res) {
                if (res.data[0].code == 1) {
                    msgdata = res.data[0].data
                    that.setmsg(msgdata)
                }
            }
        })
    },

    setmsg: function (e) {
        var that = this;
        var data = e
        var notadd = []
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                notadd.push(data[i][j])
            }
        }
        notadd = this.quickSort(notadd)
        var olddata = wx.getStorageSync('msgdata')
        var num1 = olddata.length
        if (olddata != '') {
            for (var i = 0; i < olddata.length; i++) {
                notadd.push(olddata[i])
            }
        }
        var num2 = notadd.length
        this.data.updatenum = num2 - num1
        wx.setStorageSync('msgdata', notadd)
        that.setData({
            notadd: notadd
        })
        this.addmoremsg()

    },
    addmoremsg: function (e) {
        var that = this;
        var oneadd = 8
        var notadd = this.data.notadd
        var msgdata = this.data.msgdata
        var num = msgdata.length
        if (this.data.update) {
            var num2 = that.data.updatenum
            that.data.update = false
            for (var i = 0; i < num + num2; i++) {
                msgdata[i] = notadd[i]
            }
            that.data.updatenum = 0
        }
        else if (notadd.length > num + oneadd) {
            for (var i = 0; i < num + oneadd; i++) {
                msgdata[i] = notadd[i]
            }
        } else {
            for (var i = 0; i < notadd.length; i++) {
                msgdata[i] = notadd[i]
            }
        }
        this.showmsg(msgdata)
    },
    showmsg: function (e) {
        var msgdata = e
        for (var i = 0; i < msgdata.length; i++) {
            msgdata[i].showtime = this.panduanData(msgdata[i].time)

        }
        this.setData({
            msgdata: msgdata
        })
    },
    quickSort: function (arr) {
        if (arr.length <= 1) {
            return arr;
        }
        var pivotIndex = Math.floor(arr.length / 2);
        var pivot = arr.splice(pivotIndex, 1)[0];
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].time > pivot.time) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right));
    },

    findclass: function (e) {
        var that = this;
        var classdata = that.data.classdata
        for (var i = 0; i < classdata.length; i++) {
            if (classdata[i].classid == e) {
                wx.setStorageSync('classid', e)
                wx.setStorageSync('mylevel', classdata[i].classlevel)
                return 0
            }
        }
        wx.showToast({
            title: '请先加入班级',
            icon: 'none',
            duration: 1000
        })
        return -1
    },
    ask: function (e) {
        var classid = e.currentTarget.dataset.classid
        var item = this.findclass(classid)
        if (item == 0) {
            wx.navigateTo({
                url: '../mykt_more_ask/mykt_more_ask',
            })
        }

    },
    notice: function (e) {
        var classid = e.currentTarget.dataset.classid
        var item = this.findclass(classid)
        if (item == 0) {
            wx.navigateTo({
                url: '../mykt_more_notice/mykt_more_notice',
            })
        }
    },
    sign: function (e) {
        var classid = e.currentTarget.dataset.classid
        var item = this.findclass(classid)
        if (item == 0) {
            wx.navigateTo({
                url: '../mykt_more_sign/mykt_more_sign',
            })
        }
    },
    vote: function (e) {
        var classid = e.currentTarget.dataset.classid
        var item = this.findclass(classid)
        if (item == 0) {
            wx.navigateTo({
                url: '../mykt_more_vote/mykt_more_vote',
            })
        }
    },
    getDaydata() {
        var nowDate = new Date();
        var nowDayOfWeek = nowDate.getDay();
        var nowDay = nowDate.getDate();
        var nowMonth = nowDate.getMonth();
        var nowYear = nowDate.getFullYear();
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1).getTime();
        var todaydate = new Date(nowYear, nowMonth, nowDay).getTime();
        this.setData({
            weekStartDate: weekStartDate,
            todaydate: todaydate,
        })
    },

    panduanData(time) {
        var weekStartDate = this.data.weekStartDate;
        var todaydate = this.data.todaydate;
        var nowDate = new Date().getTime();
        if (time > nowDate) {
            return "time error"
        } else if (time > todaydate & time < nowDate) {
            var hour = new Date(time).getHours();
            var minute = new Date(time).getMinutes();
            return `${hour}:${minute}`
        } else if (time < todaydate & time > weekStartDate) {
            var week = new Date(time).getDay();
            var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
            return weekArray[week]
        } else {
            var year = new Date(time).getFullYear();
            var month = new Date(time).getMonth() + 1;
            var day = new Date(time).getDate();
            return `${year}-${month}-${day}`
        }
    },
})
