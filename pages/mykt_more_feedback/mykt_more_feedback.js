
Page({

  /**
  * 页面的初始数据
  */
  data: {
    fb: [],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onShow: function (options) {    //向后端发送请求获取反馈列表
    var that = this;
    this.showadd();
    var mylevel = wx.getStorageSync('mylevel');
    if (mylevel!=1){
      var set='getmy'
    }else{
      var set='getclass'
    }
    wx.request({
      url: wx.getStorageSync('url') + 'feedback/'+set,
      data: {
        classid: wx.getStorageSync('classid'),
        openid: wx.getStorageSync('user_data').openid
      },
      success: function (res) {
        that.setData({
          fb: res.data,
        });
      }
    });
  },
 
  tap: function (e) { 
  var date = e.currentTarget.dataset.dateid;
  wx.navigateTo({
    url: '../mykt_more_feedback/mykt_more_feedback2?dateid='+date,
  })
  },
  showadd: function () {
    var mylevel = wx.getStorageSync('mylevel');
    if (mylevel != 1) {
      this.setData({
        showadd: true,
      })
    }
  },
  add_tap: function () {
    wx.navigateTo({
      url: '../mykt_more_feedback/mykt_more_feedback3',
    })
  }
})

