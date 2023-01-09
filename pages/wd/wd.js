// pages/wd/wd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zcd: 450,
    exp: 100,
    qqq: "",
    jf: 0,
    level: '',
  },

  onLoad: function (options) {
    var userdata = wx.getStorageSync('user_data')
    var level = userdata.level
    var exp = userdata.exp
    var coin = userdata.coin
    var bfb = exp / this.data.exp
    var sjcd = bfb * this.data.zcd
    this.setData({
      qqq: sjcd + "rpx",
      jf: coin,
      level: level
    })
   
  },




  gotogrxx: function () {
    wx.navigateTo({
      url: '../grxx/grxx',
    })
  },
  tcdl() {
    wx.showModal({
      content: '确认是否退出当前账号',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.clearStorage()
          const app = getApp()
          app.onShow()
          wx.reLaunch({
            url: "../dl/dl",
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})