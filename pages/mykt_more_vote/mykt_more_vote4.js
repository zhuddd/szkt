// pages/mykt_more_vote/mykt_more_vote4.js        
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        class_id: "",
        tpdata: [],
        num: [],
        choose: 0,
        backgrounda: "#1EA9FF",
        backgroundb: "#D8D8D8",
        ps: "请选择票数",
        fabu_save: '发布'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        getApp().watch('msg', this.watchBack);
        let tpdata = JSON.parse(options.obj)
        this.setData({
            tpdata: tpdata,
        })
        if (tpdata.title == '') {
            this.data.tpdata.title = util.formatTime(new Date())
            this.setData({
                tpdata: this.data.tpdata,
            })
        }
        for (var i = 1; i < tpdata.data.length; i++) {
                this.data.num[i] = i
        }
        this.setData({
            num: this.data.num,
        })
    },
    watchBack: function (name, value) {
        if (value.classid != wx.getStorageSync('classid')) {
            return
        }
    },


    show() {
        this.setData({
            choose: 1
        })

    },

    mySelect(e) {
        var ps = e.currentTarget.dataset.ps
        this.setData({
            ps: ps,
            choose: 0,
        })
    },
    bindfabu: function () {
        this.setData({
            backgrounda: "#1EA9FF",
            backgroundb: "#D8D8D8",
            fabu_save: '发布'
        })
    },
    bindsave: function () {
        this.setData({
            backgrounda: "#D8D8D8",
            backgroundb: "#1EA9FF",
            fabu_save: '保存'
        })
    },
    close: function () {
        this.setData({
            choose: 0
        })
    },
    next: function () {
        if (this.data.ps == "请选择票数") {
            wx.showToast({
                title: '请选择每人票数',
                icon: 'none',
            })
        } else {
            var that = this
            that.data.tpdata.ps = that.data.ps;
            that.data.tpdata.set = that.data.fabu_save;
            that.data.tpdata.classid = wx.getStorageSync('classid')
            that.data.tpdata.ren = 0
            that.setData({
                tpdata: that.data.tpdata,
            })
            wx.request({
                url: wx.getStorageSync('url') + 'vote/addvote/',
                data: that.data.tpdata,
                success: function (res) {
                    if (res.data == 'success') {
                        that.sendmsg()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'none',
                        })
                        wx.navigateBack({
                            delta: 2
                        })
                    } else {
                        wx.showToast({
                            title: '发布失败',
                            icon: 'none',
                        })
                    }
                }
            })
        }
    },
    sendmsg: function (e) {
        if (this.data.fabu_save == '发布') {
            wx.sendSocketMessage({
                data: JSON.stringify({
                    classid: wx.getStorageSync('classid'),
                    type: 'msg',
                    msg: 'vote',
                })
            })
        }
    },

})