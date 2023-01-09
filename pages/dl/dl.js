// pages/dl/dl.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userdata: {
            openid: '',
            older: '',

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    login: function () { //登录
        var that = this;
        wx.login({
            success: res => {
                wx.getStorage({
                    key: 'url',
                    success: function (re) {
                        var url = re.data

                        console.log(url)
                        wx.request({
                            url: url+'login',
                            data: {
                                //将code传到后端
                                code: res.code
                            },
                            success: res => {
                                console.log(res)
                                //获取到openid作为账号密码
                                that.data.userdata.older = res.data.older,
                                    that.data.userdata.openid = res.data.openid,
                                    that.data.userdata.user_name = res.data.user_name,
                                    that.data.userdata.password = res.data.password,
                                    that.data.userdata.phone = res.data.phone,
                                    that.data.userdata.email = res.data.email,
                                    that.next()
                            },
                            fail: res => {
                                wx.showToast({
                                    title: '登录失败,网络错误',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    next: function () { //跳转
        this.seave_user_data()
        if (this.data.userdata.older == "False") {
            wx.navigateTo({
                url: '../xzsf/xzsf',
            })
        }
        else if (this.data.userdata.older == "True") {
            wx.reLaunch({
                url: '../zjm/zjm',
            })
        }
    },
    seave_user_data: function () { //存储用户信息
        wx.setStorage({
            key: "user_data",
            data: this.data.userdata,
        })
    },
})