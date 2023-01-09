// pages/mykt_more_notice/mykt_more_notice3.js        
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateid: '',
    data: "",
  },

  onLoad: function (options) {
    var classid=wx.getStorageSync('classid')
    this.setData({
      dateid: Date.now(),
      classid:classid
    })
  },

  add: function () {                   //添加公告
    var that = this
    if (this.data.data == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: wx.getStorageSync('url') + 'notice/addnotice',
        data: {
          classid: wx.getStorageSync('classid'),
          dateid: this.data.dateid,
          data: this.data.data,
          openid: wx.getStorageSync('user_data').openid
        },
        success: res => {
          if (res.data == 1) {
            that.sendmsg()
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }

  },

  sendmsg: function () {                       //发送更新消息
    var that = this;
    wx.sendSocketMessage({
        data: '{"classid":"' + this.data.classid + '","type":"msg","msg":"notice"}',
    })
},
  input: function (e) {
    this.setData({
      data: e.detail.value
    })
  },
})