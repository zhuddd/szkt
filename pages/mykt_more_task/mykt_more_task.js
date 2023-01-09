// pages/mykt_more_task/alltask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showadd: false,
  },


  onShow() {
    var that = this
    var level = wx.getStorageSync('mylevel')
    if (level == 1) {
      that.setData({
        showadd: true
      })
    }
    wx.request({
      url: wx.getStorageSync('url') + 'task/getall',
      data: {
        classid: wx.getStorageSync('classid'),
        openid: wx.getStorageSync('user_data').openid,
      },
      success: function (res) {
        that.setData({
          task: that.quickSort(res.data)
        })
      }
    })
  },
  quickSort(arr) {
    if (arr.length <= 1) {
      return arr
    }
    var pivotIndex = Math.floor(arr.length / 2)
    var pivot = arr.splice(pivotIndex, 1)[0]
    var left = []
    var right = []
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].taskid > pivot.taskid) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return this.quickSort(left).concat([pivot], this.quickSort(right))
  },
  tap: function (e) {
    var taskid = e.currentTarget.dataset.taskid
    wx.setStorageSync('taskid', taskid)
    if (wx.getStorageSync('mylevel') == 1) {
      wx.navigateTo({
        url: '../mykt_more_task/onetask',
      })
    } else {
      wx.navigateTo({
        url: '../mykt_more_task/dotask',
      })
    }
  },
  add_tap: function (e) {
    wx.navigateTo({
      url: '../mykt_more_task/addtask',
    })
  }

})