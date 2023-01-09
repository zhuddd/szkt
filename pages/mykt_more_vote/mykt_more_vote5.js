// pages/mykt_more_vote/mykt_more_vote5.js
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
        let data = JSON.parse(options.data)
        this.getvote(data[0].voteid)
        this.setData({
            data: data  
        })
    },
    getvote: function (e) {
        var that = this;
        wx.request({
            url: wx.getStorageSync('url') + 'vote/getvote/',
            data: {
                classid: wx.getStorageSync('classid'),
                voteid: e,
            },
            success: function (res) {
                var set= res.data[0].set;
                var tpdata = JSON.parse(res.data[0].data);
                for (var i = 0; i < tpdata.length; i++) {
                    tpdata[i].checked = false
                }
                if (res.data[0].ren == null) {
                    var mytp=false
                } else {
                    var rendata=res.data[0].ren.split(',')
                    for (var i = 0; i < rendata.length; i++) {
                        if (rendata[i] == '') {
                            rendata.splice(i, 1)
                        }else if(rendata[i]==wx.getStorageSync('user_data').openid){
                            var mytp=true
                            break
                        }
                    }
                }
                if (mytp==true){
                    var tpset=1
                }else{
                    if(set=='发布'){
                        var tpset=0
                    }else{
                        var tpset=-1
                    }
                }
                that.setData({     
                    tpdata: tpdata,
                    checknum:res.data[0].ps,
                    title: res.data[0].title,
                    ps: res.data[0].ps,
                    tpset: tpset,
                })
            }
        });
    },

    check: function (e) {
        var num=e.detail.value.length
        var ps=this.data.ps
        var list=e.detail.value
        var tpdata = this.data.tpdata
        if(num>ps){
            wx.showToast({
                title: '最多只能选择'+ps+'项',
                icon: 'none',
                duration: 2000
            })
            this.setData({
                tpdata: tpdata,
            })
            return
        }
        for (var i = 0; i < tpdata.length; i++) {
            var change=false
            for (var j = 0; j < list.length; j++) {
                if (tpdata[i].id == list[j]) {
                    tpdata[i].checked = true
                    change=true
                }
            }
            if(!change){
                tpdata[i].checked = false
            }
        }
        this.setData({
            tpdata: tpdata,
            checknum:ps-num
        })
    },
    getdata: function () {
        var tpdata = this.data.tpdata
        var list = []
        for (var i = 0; i < tpdata.length; i++) {
            if (tpdata[i].checked) {
                list.push(tpdata[i].id)
            }
        }
        return list
    },
    tp: function () {
        var list = this.getdata()
        if (list.length == 0) {
            wx.showToast({
                title: '请选择',
                icon: 'none',
                duration: 2000
            })
            return
        }
        var data = this.data.data
        var that = this
        wx.request({
            url: wx.getStorageSync('url') + 'vote/vote/',
            data: {
                voteid: data[0].voteid,
                openid: wx.getStorageSync('user_data').openid,
                data: JSON.stringify(list),
                classid: wx.getStorageSync('classid')
            },
            success: function (res) {
                if (res.data == 'ok') {
                    wx.showToast({
                        title: '投票成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.getvote(that.data.data[0].voteid)
                }else if(res.data=='已投票'){
                    wx.showToast({
                        title: '您已经投过票了',
                        icon: 'none',
                        duration: 2000
                    })
                    that.getvote(that.data.data[0].voteid)
                }else{
                    wx.showToast({
                        title: 'error',
                        icon: 'none',
                        duration: 2000
                    })
                    that.getvote(that.data.data[0].voteid)
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})