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
            school_1: '',
            school_2: '',
            teacher_name: '',
            teach: '',
        },
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

            }
        })

    },
    nv: function () {
        this.data.userdata.sex = 'a'
    },
    nan: function () {
        this.data.userdata.sex = 'b'
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

        if (this.data.userdata.user_name == null || this.data.userdata.user_name == '') {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.userdata.userid == null || this.data.userdata.userid == '') {
            wx.showToast({
                title: '学号不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.userdata.sex == null || this.data.userdata.sex == '') {
            wx.showToast({
                title: '性别不能为空',
                icon: 'none',
                duration: 2000
            })
        } else {
            console.log(this.data.userdata)
            wx.setStorage({
                key: "user_data",
                data: this.data.userdata,
            })
            var that = this
            wx.request({
                url: wx.getStorageSync('url')+ 'login/setdata/',
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
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000//持续的时间
                        })
                    }
                }
            })

        }
    }

})