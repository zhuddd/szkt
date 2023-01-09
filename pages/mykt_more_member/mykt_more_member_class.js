// pages/mykt_more_member/mykt_more_member_class.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classlist: '',
        showadd: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var level=wx.getStorageSync('mylevel');
        if(level==1){
            this.setData({
                showadd:true
            })
        }
        wx.request({
            url:wx.getStorageSync('url')+'myclass/getclasslist/',
            data:{
                classid:wx.getStorageSync('classid'),
            },
            success:res=>{
                this.setData({
                    classlist:res.data
                })
            }
        })
    },
    tap:function(e){
        wx.navigateTo({
            url: '../mykt_more_member/mykt_more_member?classclassid='+e.currentTarget.dataset.classclassid,
        })
    }
})