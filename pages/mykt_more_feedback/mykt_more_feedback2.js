const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: "",
    dateid: "",
    List: [],
  },

  onLoad: function (options) {
    let dateid=options.dateid
    this.setData({
      dateid:dateid,

    })
    var that=this
    wx.request({
      url: wx.getStorageSync('url') + 'feedback/getclass',
      data: {
        classid: wx.getStorageSync('classid'),
        dateid: dateid,
      },
      success: function (res) {
        that.setData({
          List: res.data[0]
        });
      },
    });
  },

  del:function(){
    var that=this
    wx.request({
      url: wx.getStorageSync('url') + 'feedback/delete',
      data: {
        classid: wx.getStorageSync('classid'),
        dateid: that.data.dateid,
        openid:that.data.List.openid_id,
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      },
    });
  },
})