// pages/mykt_more/mykt_more.js
Page({


  data: {
    tap_list: [
      { "name": "公告", "url": "../mykt_more_notice/mykt_more_notice" },
      { "name": "作业", "url": "../mykt_more_task/mykt_more_task" },
      { "name": "抽问", "url": "../mykt_more_ask/mykt_more_ask" },
      { "name": "资源", "url": "../mykt_more_file/mykt_more_file" },
      { "name": "反馈", "url": "../mykt_more_feedback/mykt_more_feedback" },
      { "name": "签到", "url": "../mykt_more_sign/mykt_more_sign" },
      { "name": "投票", "url": "../mykt_more_vote/mykt_more_vote" },
      { "name": "班级", "url": "../mykt_more_member/mykt_more_member_class" },
      { "name": "设置", "url": "../mykt_more_set/mykt_more_set" },
      { "name": "测试", "url": "../mykt_more_test/mykt_more_test" },
    ],
    data: []
  },

  tap: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url != "") {
      wx.navigateTo({
        url: url,
      })
    }
  },















  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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