// pages/mykt_more_sign/mykt_more_sign4.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        end: '',
        signid: '',
        signset: [],
        openid: '',
        isqd: false,
        qdjsq: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {
        var that = this;
        var end = options.end
        var signid = options.signid
        var signset = JSON.parse(options.signset)
        var openid = wx.getStorageSync('user_data').openid
        this.setData({
            end: end,
            signid: signid,
            signset: signset,
            openid: openid,
        })
        wx.request({
            url: wx.getStorageSync('url') + 'signin/signin',
            data: {
                set: 'get',
                classid: wx.getStorageSync('classid'),
                signid: signid,
            },
            success: function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].openid == openid) {
                        if (res.data[i].sign == 1) {
                            that.setData({
                                isqd: true,
                            })
                        }
                    }
                }
            }
        })
        this.djs()
    },
    djs(e) {
        var that = this;
        var starttime = parseInt(this.data.signset.starttime)
        var endtime = parseInt(this.data.signset.endtime)
        var nowtime = parseInt(new Date().getTime())
        var time
        if (nowtime < starttime) {
            time = this.jishiqi(that, starttime) + '后开始签到'
        }
        else if (nowtime < endtime && nowtime > starttime) {
            time = this.jishiqi(that, endtime) + '后结束签到'
        }else{
        time = '签到已结束'}
        this.setData({
            time: time,
        })
        if (time=='签到已结束'){
            clearTimeout(that.data.qdjsq)
        }else{
            that.data.qdjsq = setTimeout(function () {
                that.djs()
            }, 1000)
        }
        
    },
    jishiqi(that, endtime) {
        var nowtime = new Date().getTime()
        var endtime = endtime
        var cha = endtime - nowtime
        var day = Math.floor(cha / (24 * 3600 * 1000))
        var hour = Math.floor(cha / (3600 * 1000)) - (day * 24)
        var minute = Math.floor(cha / (60 * 1000)) - (day * 24 * 60) - (hour * 60)
        var second = Math.floor(cha / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        if (cha <= 0) {
            clearTimeout(this.data.updata)
            return '已结束'
        }
        else {
            return hour + '时' + minute + '分' + second + '秒'

        }
    },
    getlock(e) {
        if (e.detail.lock != this.data.signset.password) {
            wx.showToast({
                title: '滑动错误',
                icon: 'none',
                duration: 2000
            })
        } else {

            wx.request({
                url: wx.getStorageSync('url') + 'signin/signin',
                data: {
                    set: 'updata',
                    classid: wx.getStorageSync('classid'),
                    signid: this.data.signid,
                    member: this.data.openid,
                },
                success: function (res) {
                    wx.showToast({
                        title: '签到成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
    },
    qd() {
        wx.request({
            url: wx.getStorageSync('url') + 'signin/signin',
            data: {
                set: 'updata',
                classid: wx.getStorageSync('classid'),
                signid: this.data.signid,
                member: this.data.openid,
                time: 1,
            },
            success: function (res) {
                if (res.data == 'timeerror') {
                    wx.showToast({
                        title: '未在规定时间内签到',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: '签到成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }
            }
        })
    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clearTimeout(this.data.qdjsq)
    },
    onHide() {
        clearTimeout(this.data.qdjsq)
    }
})