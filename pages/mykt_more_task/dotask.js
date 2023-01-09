// pages/mykt_more_task/dotask.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: "",
        do: false,
        answer:' ',
        lv: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow(options) {
        var taskid = wx.getStorageSync('taskid');
        var classid = wx.getStorageSync('classid');
        this.getquestion(taskid, classid);
        this.getanswer(taskid, classid);
    },
    getanswer(taskid, classid) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'task/onetasklook',
            data: {
                taskid: taskid,
                classid: classid,
                openid: wx.getStorageSync('user_data').openid
            },
            success: function (res) {
                console.log(res.data)
                if (res.data != 'error') {
                    that.data.do = true;
                    that.setData({
                        answer: res.data.data,
                        lv: res.data.lv,
                    })
                }
            }
        })
    },
    getquestion(taskid, classid) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'task/getquestion',
            data: {
                taskid: taskid,
                classid: classid,
            },
            success: function (res) {
                that.setData({
                    data: res.data,
                })
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        })
    },
    input(e) {
        var value = e.detail.value;
        this.setData({
            answer: value,
        })
    },
    send() {
        var that = this;
        if(this.data.do){
            wx.showModal({
                title: '提示',
                content: '已经提交过了，是否继续提交？',
                success: function (res) {
                    if (!res.confirm) {
                        return;
                    } else {
                        that.end()
                    }
                }
            })
        }else{
            that.end()
        }
    },
    end() {
        var taskid = wx.getStorageSync('taskid');
        var classid = wx.getStorageSync('classid');
        var openid = wx.getStorageSync('user_data').openid;
        var answer = this.data.answer;
        wx.request({
            url: wx.getStorageSync('url') + 'task/sendanswer',
            data: {
                taskid: taskid,
                classid: classid,
                answer: answer,
                openid: openid,
            },
            success: function (res) {
                if (res.data == 'success') {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 2000)
                }
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        })
    }
})