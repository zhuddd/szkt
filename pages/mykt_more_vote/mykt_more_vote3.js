// pages/mykt_more_vote/mykt_more_vote3.js        
const util = require('../../utils/util.js')
Page({

    /**
    * 页面的初始数据
    */
    data: {
        data: "",
        class_id: "",
        List: [],
        tpdata: [],
        title: "",
    },
    onLoad: function (options) {
        try{
            var data=JSON.parse(options.alldata);
            this.getvote(data[0].voteid);
        }
        catch(e){
        }
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
                var tpdata=JSON.parse(res.data[0].data);
                
                that.setData({
                    tpdata: tpdata,
                })
            }
        });
    },
    add: function () {   //添加选项
        var tpdata = this.data.tpdata;
        var time = new Date().getTime();
        tpdata.push({
            data: null,
            id: time,
            getps: 0,
        });
        this.setData({
            tpdata: tpdata,
        });
    },
    input: function (e) {   //输入选项名称
        var dataid = e.currentTarget.dataset.id
        var data = e.detail.value
        for (var i = 0; i < this.data.tpdata.length; i++) {
            if (this.data.tpdata[i].id == dataid) {
                this.setData({
                    ['tpdata[' + i + '].data']: data,
                })
            }
        }
    },
    delxx: function (e) {   //删除选项
        var dataid = e.currentTarget.dataset.id
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除该选项吗？',
            success: function (res) {
                if (res.confirm) {
                    for (var i = 0; i < that.data.tpdata.length; i++) {
                        if (that.data.tpdata[i].id == dataid) {
                            that.data.tpdata.splice(i, 1);
                        }
                    }
                    that.setData({
                        tpdata: that.data.tpdata,
                    });
                }
            }
        })         
        
    },
    clean: function () {    //清除名称为空的选项
        var a = this.data.tpdata, b = []
        for (var i = 0; i < a.length; i++) {
            if (a[i].data != null) {
                b.push(a[i])
            }
        }
        this.setData({
            tpdata: b
        });
        return 1;
    },
    next: function () {    //校验数据并跳转
        if (this.clean() == 1) {
            if (this.data.tpdata.length >= 2) {
                var obj = {}
                obj.title = this.data.title
                obj.data = this.data.tpdata
                wx.navigateTo({
                    url: '../mykt_more_vote/mykt_more_vote4?obj=' + JSON.stringify(obj),
                })
            } else if (this.data.tpdata.length < 2 & this.data.tpdata.length > 0) {
                wx.showToast({
                    title: '选项过少',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                wx.showToast({
                    title: '请填写完整',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    },
    title: function (e) {
        this.setData({
            title: e.detail.value
        })
    }

})