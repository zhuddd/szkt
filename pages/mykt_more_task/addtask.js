// pages/mykt_more_task/addtask.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: "",
    },

    input: function (e) {
        this.data.text = e.detail.value;
    },
    seave: function () {
        if (this.data.text == "") {
            wx.showToast({
                title: '请填写任务内容',
                icon: 'none',
                duration: 2000
            })
        } else {
            var id = Date.now()
            console.log(id)
            wx.request({
                url: wx.getStorageSync('url') + 'task/addtask',
                data: {
                    id: id,
                    task: this.data.text,
                    classid: wx.getStorageSync('classid'),
                },
                success: function (res) {
                    if (res.data == "success") {
                        wx.showToast({
                            title: '添加成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    } else if(res.data=="error"){
                        wx.showToast({
                            title: '添加失败',
                            icon: 'none',
                            duration: 2000

                        })
                    }
                }
            })

        }
    }
})