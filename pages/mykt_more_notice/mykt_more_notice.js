// pages/mykt_more_notice/mykt_more_notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
    showadd: false,
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.showadd();
    var that = this
    this.updata()             //公告列表动态更新
    getApp().watch('msg', this.watchBack);
  },
  watchBack: function (name, value) {
    if (value.classid!=wx.getStorageSync('classid')){
      return
  }
    if (value.data == 'notice') {
      this.updata()
    }
  },
  updata: function (e) {
    var that = this
    this.showadd();
    wx.request({
      url: wx.getStorageSync("url") + 'notice/getnotice',
      data: {
        classid: wx.getStorageSync("classid"),
      },
      success: res => {
        var list = []
        for (var i = 0; i < res.data.length; i++) {
          list.unshift(res.data[i])
        }
        this.setData({
          noticeList: list
        })
      }
    })
  },

  tap: function (e) {
    var data = e.currentTarget.dataset.data;
    var date = e.currentTarget.dataset.date;
    wx.navigateTo({
      url: '../mykt_more_notice/mykt_more_notice2?data=' + JSON.stringify(data) + '&date=' + JSON.stringify(date),
    })
  },
  add_tap: function () {
    wx.navigateTo({
      url: '../mykt_more_notice/mykt_more_notice3',
    })
  },
  showadd: function () {
    var mylevel = wx.getStorageSync("mylevel")
    if (mylevel == 1 || mylevel == 2) {
      this.setData({
        showadd: true
      })
    } else {
      this.setData({
        showadd: false
      })
    }
  },
})