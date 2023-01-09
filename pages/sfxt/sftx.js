// pages/sfxt/sftx.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userdata: {
            sex: null,
            user_name: null,
            userid: null,
        },


        set: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: "user_data",
            success: function (res) {
                that.setData({
                    userdata: res.data
                })
                that.data.userdata.user_name = ''
                that.data.userdata.userid = ''
                that.data.userdata.sex = ''
                that.data.userdata.school_1 = ''
                that.data.userdata.school_2 = ''
                that.data.userdata.teacher_name = ''
                that.data.userdata.teach = ''
            }
        })

    },

    nv: function () {
        this.data.userdata.sex = 'b'
    },
    nan: function () {
        this.data.userdata.sex = 'a'
    },
    name: function (e) {
        this.data.userdata.user_name = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })

    },
    id: function (e) {
        this.data.userdata.userid = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })

    },
    school_1: function (e) {
        this.data.userdata.school_1 = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })
    },
    school_2: function (e) {
        this.data.userdata.school_2 = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })
    },
    teacher_name: function (e) {
        this.data.userdata.teacher_name = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })
    },
    teach: function (e) {
        this.data.userdata.teach = e.detail.value
        this.setData({
            userdata: this.data.userdata
        })
    },
    next: function (e) {
        var that = this
        if (that.data.userdata.user_name == null || that.data.userdata.user_name == '') {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.userdata.userid == null || that.data.userdata.userid == '') {
            wx.showToast({
                title: '学号不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.userdata.sex == null || that.data.userdata.sex == '') {
            wx.showToast({
                title: '性别不能为空',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.getStorage({
                key: "url",
                success: function (res) {
                    wx.request({
                        url: res.data+'login/setdata/',
                        data: {
                            user_name: that.data.userdata.user_name,
                            userid: that.data.userdata.userid,
                            sex: that.data.userdata.sex,
                            openid: that.data.userdata.openid,
                            school_1: that.data.userdata.school_1,
                            school_2: that.data.userdata.school_2,
                            teacher_name: that.data.userdata.teacher_name,
                            teach: that.data.userdata.teach,
                            is_teacher: that.data.userdata.is_teacher
                        },
                        success: res => {
                            if (res.data == 'error') {
                                wx.showToast({
                                    title: '发生未知错误',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                            else {
                                wx.setStorage({
                                    key: "user_data",
                                    data: that.data.userdata,
                                    success: function (res) {
                                        wx.reLaunch({
                                            url: '../zjm/zjm',
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })


        }



    }

})