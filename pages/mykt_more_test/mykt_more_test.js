// pages/mykt_more_test/mykt_more_test.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var mylevel=wx.getStorageSync('mylevel')
    if(mylevel=='1'){
      this.setData({
        showadd:true
      })
    }
    var classid=wx.getStorageSync('classid')
    var that=this
    wx.request({
      url:wx.getStorageSync('url')+'stutest/gettestlist',
      data:{
        classid:classid
      },
      success:function(res){
        var list=res.data
        var testlist=[]
        for(var i=list.length;i>0;i--){
          testlist.push(list[i-1])
        }
        that.setData({
          testlist:testlist
        })
      }
    })

  },

  tap: function (e) {
    var testid = e.currentTarget.dataset.testid
    var set=e.currentTarget.dataset.set
    var mylevel = wx.getStorageSync('mylevel')
    if (mylevel == '1') {
      wx.navigateTo({
        url: './mykt_more_test2?testid=' + testid+'&set='+set,
      })
    }else{
      wx.navigateTo({
        url: './mykt_more_test5?testid=' + testid,
      })
    }
  },
  add_tap: function () {
    wx.navigateTo({
      url: './mykt_more_test4',
    })
  },
})