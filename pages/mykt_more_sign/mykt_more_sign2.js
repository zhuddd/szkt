// pages/mykt_more_sign/mykt_more_sign2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        signid: '',
        memberdata: [],
        end: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            signid: options.signid,
            end: options.end,
        })
        this.getdata()
    },

    getdata: function (e) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'signin/signin',
            data: {
                set: 'get',
                classid: wx.getStorageSync('classid'),
                signid: this.data.signid,
            },
            success: function (res) {
                var list=[];
                for (var i = 0; i < res.data.length; i++) {
                    console.log(res.data[i].sign)
                    if (res.data[i].sign == '1') {
                        list.unshift(res.data[i])
                    }else
                    {
                        list.push(res.data[i])
                    }
                }
                that.setData({
                    memberdata: list,
                })
            }
        })
    },
    end: function (e) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'signin/signin',
            data: {
                set: 'end',
                classid: wx.getStorageSync('classid'),
                signid: this.data.signid,
            },
            success: function (res) {
                if (res.data == 'success') {
                    wx.showToast({
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        end: '1',
                    })
                }
            }
        })
    },
    tap: function (e) {
        var that = this;
        var openid = e.currentTarget.dataset.openid
        wx.request({
            url: wx.getStorageSync('url') + 'signin/signin',
            data: {
                set: 'updata',
                classid: wx.getStorageSync('classid'),
                signid: this.data.signid,
                time: -1,
                member: openid,
            },
            success: function (res) {
                that.getdata()
            }
        })
    }
})