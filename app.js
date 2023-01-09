// app.js
App({
    onShow() {
        wx.setStorage({
            key: 'url',
            //data: 'https://h17i395219.oicp.vip/',
            //data:'http://192.168.137.1:8888/'
            data: 'http://127.0.0.1:8888/'
            //data:'http://192.168.171.84:8888/'
        })
        wx.setStorage({
            key: 'wsk',
            //data: 'ws://h17i395219.oicp.vip/ws/msg/'
            data: 'ws://127.0.0.1:8888/ws/msg/'
            //data:'http://192.168.171.84:8888/ws/msg/'
            //data: 'ws://192.168.137.1:8888/ws/msg/'
        })
    },

    onLaunch: function () {
        if (!this.globalData.isconn) {
            this.conn()
        }
    },
    conn: function () {
        if (!this.globalData.isconn) {
            var that = this
            var wsk = wx.connectSocket({
                url: wx.getStorageSync('wsk') + '/',
            })
        }
        wx.onSocketOpen(res => {
            console.log('WebSocket连接已打开:')
            that.globalData.isconn = true
            wx.sendSocketMessage({
                data: '{"type":"setclass","openid":"' + wx.getStorageSync('user_data').openid + '"}',
            })

            wsk.onClose(res => {
                console.log('WebSocket 已关闭！')
                that.globalData.isconn = false
                console.log('重连')
                this.conn()
            })
            wsk.onMessage(function (res) {
                that.globalData.msg = JSON.parse(res.data)
                that.globalData.qjmsg = JSON.parse(res.data)
            })
        })
    },

    watch: function (variate, method) {
        var obj = this.globalData;
        let val = obj[variate];// 单独变量来存储原来的值
        Object.defineProperty(obj, variate, {
            configurable: true,
            enumerable: true,
            set: function (value) {
                val = value;// 重新赋值
                method(variate, value);// 执行回调方法
            },
            get: function () {
                // 在其他界面调用getApp().globalData.variate的时候，这里就会执行。
                return val; // 返回当前值
            }
        })
    },

    globalData: {
        isconn: false,
        msg: '',
        qjmsg: '',
    }
})
