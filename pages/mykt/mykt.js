// pages/mykt/mykt.js
const url = wx.getStorageSync('url')
const socket = require('../../utils/socket.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        maildata: [],
        msg: '',
        toend: '',
        ksbox: false,
        tap_list: [
            { "name": "抽问", "url": "../mykt_more_ask/mykt_more_ask" },
            { "name": "签到", "url": "../mykt_more_sign/" },
            { "name": "投票", "url": "../mykt_more_vote/" },
        ],
    },


    /** 开始 */
    onShow: function (options) {
        var that = this
        var openid = wx.getStorageSync('user_data').openid
        var classid = wx.getStorageSync('classid')
        var maildata = wx.getStorageSync('maildata' + classid)
        var mylevel = wx.getStorageSync('mylevel')
        this.setData({
            classid: classid,
            openid: openid,
            maildata: maildata,
            mylevel: mylevel,
        })
        this.getmaildata()
        this.getpptpage()

        this.start()  //旋转图片
        setTimeout(() => {
            that.setData({
                toend: "toend"
            })
        }, 100);
        getApp().watch('msg', this.watchBack);
    },

    watchBack: function (name, value) {
        if (value.classid != wx.getStorageSync('classid')) {
            return
        }
        var that = this
        if (value.data == 'mail') {
            that.getmaildata()
        } else if (value.data == 'pptpage') {
            that.getpptpage()
        }
    },


    more: function () {                 //加载更多
        wx.navigateTo({
            url: '../mykt_more/mykt_more',
        })
    },

    start: function () {
        var animation = wx.createAnimation({
            duration: 1,
            timingFunction: 'step-start',
            delay: 0
        });
        animation.rotateZ(90).step()
        this.setData({
            ani: animation.export()
        })
    },

    getpagelist: function () {          //获取课程页数
        var that = this
        wx.request({
            url: url + 'attendclass/getpagelist/',
            data: {
                classid: that.data.classid
            },
            success: function (res) {
                var urllist = new Array()
                for (var i = 0; i < res.data.length; i++) {
                    var page = res.data[i].replace(/[^0-9]/ig, "")
                    urllist[page - 1] = { no: page, url: url + 'allfile/attendclass/' + that.data.md5 + '/' + res.data[i], page: res.data[i] }
                }
                that.setData({
                    urllist: urllist
                })
            }
        })
    },

    radiochoose: function (e) {          //选择页数
        var page = e.detail.value
        var that = this
        that.setData({
            choosepage: page
        })
    },
    play: function () {                 //播放
        var that = this
        var choosepage = that.data.choosepage
        if (choosepage == undefined) {
            wx.showToast({
                title: '请选择页数',
                icon: 'none'
            })
            return
        }
        wx.request({
            url: url + 'attendclass/setpage/',
            data: {
                classid: that.data.classid,
                page: choosepage
            },
            success: function (res) {
                that.pageupdata()
            }
        })
    },
    stop: function () {                 //停止
        var that = this
        wx.request({
            url: url + 'attendclass/setpage/',
            data: {
                classid: that.data.classid,
                page: 'None'
            },
            success: function (res) {
                that.pageupdata()
            }
        })
    },
    back: function () {                 //上一页
        var that = this
        var no = that.data.page.replace(/[^0-9]/ig, "")
        var urllist = that.data.urllist
        if (no > 1) {
            wx.request({
                url: url + 'attendclass/setpage/',
                data: {
                    classid: that.data.classid,
                    page: urllist[no - 2].page
                },
                success: function (res) {
                    that.pageupdata()
                }
            })
        } else {
            wx.showToast({
                title: '已经是第一页了',
                icon: 'none',
                duration: 2000
            })
        }
    },
    next: function () {                 //下一页
        var that = this
        var no = that.data.page.replace(/[^0-9]/ig, "")
        var urllist = that.data.urllist
        if (no < urllist.length) {
            wx.request({
                url: url + 'attendclass/setpage/',
                data: {
                    classid: that.data.classid,
                    page: urllist[no].page
                },
                success: function (res) {
                    that.pageupdata()
                }
            })
        } else {
            wx.showToast({
                title: '已经是最后一页了',
                icon: 'none',
                duration: 2000
            })
        }
    },
    pageupdata: function () {           //更新页数
        wx.sendSocketMessage({
            data: '{"classid":"' + this.data.classid + '","type":"msg","msg":"pptpage"}',
        })
    },

    getpptpage: function (e) {          //获取ppt页码
        var that = this
        wx.request({
            url: url + 'attendclass/getpage/',
            data: {
                classid: that.data.classid,
            },
            success: function (res) {
                var md5 = res.data.md5
                var page = res.data.page
                var type
                var onclass
                if (that.data.mylevel == 1) {                   //判断是否是老师

                    if (md5) {
                        that.getpagelist()
                        if (page == 'None') {
                            type = 2
                            onclass = false
                        } else {
                            type = 3
                            onclass = true
                        }
                    } else {
                        type = 1
                        onclass = false
                    }
                    that.setData({
                        type: type,
                        onclass: onclass,
                        pageurl: url + 'allfile/attendclass/' + md5 + '/' + page,
                        page: page,
                        md5: md5,
                    })

                } else {                                    //学生
                    if (md5) {

                        if (page == 'None') {
                            type = 3
                            onclass = false
                        } else {
                            type = 3
                            onclass = true
                        }
                    } else {
                        type = 3
                        onclass = false
                    }
                    that.setData({
                        type: type,
                        onclass: onclass,
                        pageurl: url + 'allfile/attendclass/' + md5 + '/' + page,
                        page: page,
                        md5: md5,
                    })
                }

            }
        })

    },

    getmaildata: function () {                                      //获取聊天数据
        var that = this;
        var maildata = wx.getStorageSync('maildata' + that.data.classid)
        var lastTime = 0
        if (maildata == '') {
            lastTime = 0
        } else {
            lastTime = maildata[maildata.length - 1].time
        }
        wx.request({
            url: url + 'mail/getmail',
            data: {
                classid: that.data.classid,
                openid: that.data.openid,
                lastTime: lastTime,
            },
            method: 'GET',
            success: function (res) {
                var i = res.data.length - 1
                if (res.data[i].status == 0) {
                    wx.showToast({
                        title: res.data[i].msg,
                        icon: 'none',
                        duration: 2000
                    })
                } else if (res.data[i].status == 1) {
                    res.data.splice(i, 1)
                    that.save(res)
                }
            }
        })
    },



    save(res) {                             //保存数据
        var that = this
        var newdata = res.data
        if (newdata.length > 0) {
            for (var i = 0; i < newdata.length; i++) {
                if (newdata[i].openid == that.data.openid) {
                    newdata[i].set = 'r'
                }
                else {
                    newdata[i].set = 'l'
                }
            }
            var maildata = wx.getStorageSync('maildata' + that.data.classid)
            if (maildata == []) {
                maildata = newdata
            } else {
                maildata = maildata.concat(newdata)
            }
            that.setData({
                maildata: maildata,
            })
            wx.setStorageSync('maildata' + this.data.classid, maildata)
            that.setData({
                toend: "toend"
            })
        }

    },
    msginput: function (e) {                        //输入框
        this.setData({
            msg: e.detail.value,
        })
    },
    sedmsg: function () {                           //发送消息
        var that = this;
        var msg = that.data.msg
        that.setData({
            msg: '',
        })
        if (msg != '') {
            wx.request({
                url: url + 'mail/sedmail',
                data: {
                    classid: that.data.classid,
                    openid: that.data.openid,
                    msg: msg,
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.status == 1) {
                        that.sendupdata()
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
            })
        }
    },
    sendupdata: function () {                       //发送更新消息
        var that = this;
        wx.sendSocketMessage({
            data: '{"classid":"' + this.data.classid + '","type":"msg","msg":"mail"}',
        })

    },



    upload: function () {                           //上传ppt
        wx.navigateTo({
            url: '../mykt/uploadppt',
        })
    },
    showksbox: function () {                     //显示考试框
        this.setData({
            ksbox: !this.data.ksbox,
        })
    },
    tap: function (e) {
        var url = e.currentTarget.dataset.url;
        var name = e.currentTarget.dataset.name;
        switch (name) {
            case '抽问':
                wx.navigateTo({
                    url: url,
                })
                break;
            case '签到':
                if (wx.getStorageSync('mylevel') == 1) {
                    wx.navigateTo({
                        url: url + 'mykt_more_sign3',
                    })
                }else{
                    wx.navigateTo({
                        url: url + 'mykt_more_sign',
                    })
                }
                break;
            case '投票':
                wx.navigateTo({
                    url: url + 'mykt_more_vote',
                })
                break;
        }

    },

})