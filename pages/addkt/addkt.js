// pages/addkt/addkt.ts
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_id: "",
    name: "",
    class_class_data: [],
    creator: "",
    openid: "",
    yqm: "",
  },
  onLoad: function (options) {
    this.data.class_id = util.getid(10)
    this.data.yqm = this.data.class_id.substr(0, 5)
    wx.getStorage({
      key: 'user_data',
      success: res => {
        this.data.creator = res.data.user_name
        this.data.openid = res.data.openid
      }
    })
  },

  input: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  add: function () {                                                                                   //添加班级
    this.data.class_class_data.push({
      data: null,
      class_class_id: util.getid(10),
      name: null,
    });
    this.setData({
      class_class_data: this.data.class_class_data,
    });
  },
  class_name: function (e) {                                                                          //班级名称
    var dataid = e.currentTarget.dataset.id
    var data = e.detail.value
    for (var i = 0; i < this.data.class_class_data.length; i++) {
      if (this.data.class_class_data[i].class_class_id == dataid) {
        this.setData({
          ['class_class_data[' + i + '].name']: data,
        })
      }
    }
  },
  del: function (e) {                                                                                 //删除班级
    var dataid = e.currentTarget.dataset.id
    for (var i = 0; i < this.data.class_class_data.length; i++) {
      if (this.data.class_class_data[i].class_class_id == dataid) {
        this.data.class_class_data.splice(i, 1);
      }
    }
    this.setData({
      class_class_data: this.data.class_class_data,
    });
  },
  clean: function () {                                                                                  //创建课堂前清除没有名称的班级
    for (var i = 0; i < this.data.class_class_data.length; i++) {
      if (this.data.class_class_data[i].name == '' || this.data.class_class_data[i].name == null) {
        this.data.class_class_data.splice(i, 1);
      }
    }
    this.setData({
      class_class_data: this.data.class_class_data,
    });
    return 1
  },


  jump: function () {                          //跳转
    this.clean()                                //清除空名称班级
    if (this.clean() == 1 && this.data.class_class_data.length > 0) {
      if (this.data.name == "") {              //课堂名称为空
        wx.showToast({
          title: '请输入课堂名称',
          icon: 'none',
          duration: 2000
        })

      }
      else {                                 //信息通过校验    
        var that = this
        wx.getStorage({
          key: 'url',
          success: function (re) {
            var url = re.data
            wx.request({
              url: url + 'joinadd/add/',
              data: {
                class_id: that.data.class_id,
                name: that.data.name,
                class_class_data: that.data.class_class_data,
                creator: that.data.creator,
                openid: that.data.openid,
                yqm: that.data.yqm,
              },
              success: res => {
                if (res.data == "success") {
                  wx.showToast({
                    title: '创建成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              }
            })
          }
        })
        wx.reLaunch({                     //返回主界面
          url: '/pages/zjm/zjm',
        })
      }
    } else {                               //班级为空
      wx.showToast({
        title: '请添加班级',                //
        icon: 'none',
        duration: 2000
      })
    }
  },
})