// pages/mykt_more_test/mykt_more_test2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var testid = options.testid
        var set = options.set
        var classid = wx.getStorageSync('classid')
        this.setData({
            testid: testid,
            classid: classid,
            set: set
        })
        var that = this
        wx.request({
            url: wx.getStorageSync('url') + 'stutest/getone',
            data: {
                testid: testid,
                classid: classid,
            },
            success: function (res) {
                var test = res.data
                for(var i=0;i<test.length;i++){
                    if(test[i].cj==''){
                        test[i].fs=-1
                        test[i].cj = false
                    }else{
                        var cj=JSON.parse(test[i].cj)
                        test[i].fs=cj[0]
                        test[i].cj = true
                    }
                }
                test=that.bubbleSort(test)
                that.setData({
                    memberdata: test
                })
            }
        })
    },
    bubbleSort(arr) {
        var arr=arr
        var len = arr.length;
        for (var i=0; i<len; i++) {
            for (var j=0; j<len-1-i; j++) {
                if (arr[j].fs < arr[j+1].fs) {
                    var temp = arr[j+1];
                    arr[j+1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    },

    tap: function (e) {
        var openid=e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../mykt_more_test/mykt_more_test5?openid='+openid+'&testid='+this.data.testid+'&superuser=true',
        })
    },
    end: function (e) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'stutest/endtest',
            data: {
                classid: wx.getStorageSync('classid'),
                testid: this.data.testid,
            },
            success: function (res) {
                if (res.data == 'success') {
                    wx.showToast({
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        set: '2',
                    })
                }
            }
        })
    },
    deltest: function (e) {
        var that=this;
        wx.showModal({
            title: '提示',
            content: '确定删除此次测试吗？',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: wx.getStorageSync('url') + 'stutest/deltest',
                        data: {
                            classid: wx.getStorageSync('classid'),
                            testid: that.data.testid,
                        },
                        success: function (res) {
                            if (res.data == 'success') {
                                wx.showToast({
                                    icon: 'success',
                                    duration: 2000
                                })
                                setTimeout(function () {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }, 2000)
                            }
                        }
                    })
                }
            }
        })
    },
})