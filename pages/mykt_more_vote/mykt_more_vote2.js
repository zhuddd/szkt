// pages/mykt_more_vote/mykt_more_vote2.js        
Page({
    /**
    * 页面的初始数据
    */
    data: {
    },
    onLoad: function (options) {
        var votedata = JSON.parse(options.alldata)
        this.setData({
            votedata: votedata,
        })
        this.getvote();
    },
    getvote: function (e) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'vote/getvote/',
            data: {
                classid: wx.getStorageSync('classid'),
                voteid: this.data.votedata[0].voteid,
            },
            success: function (res) {
               that.breakdata(res.data);
            }
        });
    },
    breakdata: function (e) {
        var data=e;
        var titel=data[0].title;
        var tpdata=JSON.parse(data[0].data);

        if (data[0].ren == null) {
            var ren = 0
        } else {
            var rendata=data[0].ren.split(',')
            for (var i = 0; i < rendata.length; i++) {
                if (rendata[i] == '') {
                    rendata.splice(i, 1)
                }
            }
            var ren = rendata.length
        }
        var set=data[0].set;
        this.setData({
            ren: ren,
            tp: tpdata,
            titel: titel,
            set: set,
        })
    },

    stop: function (e) {   //结束投票
        var that = this
        wx.request({
            url: wx.getStorageSync('url') + 'vote/setvote/',
            data: {
                classid: wx.getStorageSync('classid'),
                voteid: this.data.votedata[0].voteid,
            },
            success: function (res) {
                if (res.data == 'success') {
                    that.setData({
                        set: '已结束'
                    })
                } else {
                    wx.showToast({
                        title: '操作失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        });
    },
    del: function (e) {   //删除投票
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定删除该投票吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: wx.getStorageSync('url') + 'vote/delvote/',
                        data: {
                            classid: wx.getStorageSync('classid'),
                            voteid: that.data.votedata[0].voteid,
                        },
                        success: function (res) {
                            if (res.data == 'success') {
                                wx.navigateBack({
                                    delta: 1
                                })
                            } else {
                                wx.showToast({
                                    title: '操作失败',
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        }
                    });
                }
            }
        })
    },

})