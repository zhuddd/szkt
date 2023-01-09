// pages/mykt_more_set/mykt_more_set.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: '',
    classid: "",
    newname: '',
    yqm: '',
    mylevel: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({   //获取二维码图片
      key: "classid",
      success: function (res) {
        that.setData({
          classid: res.data,
          yqm: wx.getStorageSync('classid').substr(0, 5),
          qrcode: 'https://api.pwmqr.com/qrcode/create/?url=' + res.data.substr(0, 5)
        })
      }
    })
    wx.request({    //获取课堂名称
      url: wx.getStorageSync('url') + 'myclass/classset/',
      data: {
        classid: wx.getStorageSync('classid'),
        set: 'get'
      },
      success: function (res) {
        that.setData({
          newname: res.data
        });
      }
    })
    this.setData({
      mylevel: wx.getStorageSync('mylevel')
    })
  },

  input: function (e) {
    this.setData({
      newname: e.detail.value
    })
  },

  change: function () {   //修改课堂名称
    var that = this
    if (this.data.newname != '') {
      wx.request({
        url: wx.getStorageSync('url') + 'myclass/classset/',
        data: {
          classid: wx.getStorageSync('classid'),
          classname: that.data.newname,
          set: 'set'
        },
        success: function (res) {
          if (res.data == 'success') {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })
            that.onLoad()
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '名称不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },
  js: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: wx.getStorageSync('url') + 'myclass/classset/',
            data: {
              set: 'del',
              classid: wx.getStorageSync('classid'),
            },
            success: res => {
              if (res.data == 'success') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.reLaunch({
                  url: '../zjm/zjm',
                })
              }
            }
          })
        }
      }
    })
  },
  lk: function () {
    var classid = this.data.classid
    var openid = wx.getStorageSync('user_data').openid
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: wx.getStorageSync('url') + 'myclass/delmember/',
            data: {
              classid: classid,
              openid: openid
            },
            success: function (res) {
              if (res.data == 'success') {
                wx.sendSocketMessage({
                  data: '{"classid":"' +  wx.getStorageSync('classid') + '","type":"closeclass"}',
              })
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.reLaunch({
                  url: '../zjm/zjm',
                })
              }
            }
          })
        }
      }
    })
  },


})