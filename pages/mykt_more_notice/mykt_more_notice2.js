// pages/mykt_more_notice/mykt_more_notice2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: "",
    date: "",
    showdel: false,
  },
  onLoad: function (options) {
    this.showdel();
    let data = JSON.parse(options.data)
    let date = JSON.parse(options.date)
    this.setData({
      data: data,
      date: date,
    })
  },


  del: function () {     //删除公告
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'url',
            success: url => {
              wx.request({
                url: url.data + 'notice/delnotice',
                data: {
                  classid:wx.getStorageSync('classid'),
                  dateid: that.data.date
                },
                success: res => {
                  that.sendmsg()
                  if (res.data == 1) {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                }
              })
            }
          }
          )
        }
      }
    })
  },
  sendmsg: function () {                       //发送更新消息
    console.log('发送更新消息')
    wx.sendSocketMessage({
        data: '{"classid":"' +  wx.getStorageSync('classid') + '","type":"msg","msg":"notice"}',
    })
    wx.navigateBack({
      delta: 1
    })
},
  showdel: function () {
    var mylevel = wx.getStorageSync("mylevel")
    if (mylevel == 1||mylevel==2) {
      this.setData({
        showdel: true
      })
    }else{
      this.setData({
        showdel: false
      })
    }
  },
})