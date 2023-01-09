// pages/mykt_more/mykt_more.js
Page({


    data: {
        show: false,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        var that = this
        var openid = wx.getStorageSync('user_data').openid
        var classid = wx.getStorageSync('classid')
        this.setData({
            classid: classid,
            openid: openid,

        })
        this.showadd();
        this.getfilelist();
    },



    getfilelist: function () {
        var that = this
        var classid = that.data.classid
        wx.request({
            url: wx.getStorageSync('url') + 'file/getfilelist',
            data: {
                classid: classid,
            },
            method: 'GET',
            success: function (res) {
                that.listset(res.data)
            }
        })
    },
    listset: function (e) {
        var that = this
        var list = e
        for (var i = 0; i < list.length; i++) {
            var md5 = list[i].md5
            var filename = list[i].filename
            var path = wx.env.USER_DATA_PATH + '/' + md5 + filename
            var size = list[i].size
            try {
                wx.getFileSystemManager().accessSync(path)
                list[i].isdown = '已下载'
            } catch (e) {
                if (size > 200000000) {
                    list[i].isdown = '浏览器下载'
                } else {
                    list[i].isdown = '未下载'
                }
            }
        }
        that.setData({
            filelist: list,
        })
    },
    choose: function () {
        var that = this
        wx.showModal({
            title: '请选择文件上传方式',
            content: '哪里选择文件',
            cancelText: '聊天记录',
            confirmText: '本地文件',
            success: function (res) {
                if (res.cancel) {
                    console.log('聊天记录')
                    that.uploadFile();
                } else if (res.confirm) {
                    console.log('本地文件')
                    wx.navigateTo({
                        url: '../mykt_more_file/mykt_more_upfile',
                    })
                }
            }

        })
    },
    uploadFile: function (e) {          //上传文件
        var that = this
        var openid = that.data.openid
        var url = wx.getStorageSync('url')
        wx.chooseMessageFile({                  //选择文件
            count: 1,
            type: 'file',
            success(res) {
                console.log(res)
                var path = res.tempFiles[0].path
                var name = res.tempFiles[0].name
                var size = res.tempFiles[0].size
                var type = res.tempFiles[0].type
                that.setData({
                    path: path,
                    name: name,
                    type: type,
                })
                wx.getFileInfo({                //获取文件信息
                    filePath: path,
                    success(res) {
                        var md5 = res.digest
                        wx.request({
                            url: url + 'file/uploadmd5/',
                            data: {
                                'md5': md5,
                                'classid': wx.getStorageSync('classid'),
                                'openid': openid,
                                'filename': name,
                            },
                            success(res) {
                                if (res.data == 1) {                     //如果文件未存在
                                    var list = that.data.filelist
                                    list.unshift({
                                        'md5': md5,
                                        'filename': name,
                                        'size': size,
                                        'isdown': '',
                                    })
                                    that.setData({
                                        filelist: list,
                                    })
                                    var updata = wx.uploadFile({                 //上传文件
                                        url: url + 'file/uploadfile/',
                                        filePath: path,
                                        name: 'file',
                                        formData: {
                                            'openid': openid,
                                            'classid': wx.getStorageSync('classid'),
                                            'filename': name,
                                            'size': size,
                                            'type': type,
                                        },
                                        success(res) {
                                            wx.showToast({
                                                title: 'success',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                            that.getfilelist();
                                        }
                                    })
                                    updata.onProgressUpdate((res) => {
                                        if (res.progress == 100) {
                                            that.setData({
                                                ['filelist[0].isdown']: '已上传'
                                            })
                                            wx.showToast({
                                                title: '下载完成',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                        } else {
                                            that.setData({
                                                ['filelist[0].isdown']: '上传中：' + res.progress + '%'
                                            })
                                        }
                                        // wx.showToast({
                                        //     title: '上传中' + res.progress + '%',   //显示上传进度
                                        //     icon: 'loading',
                                        //     duration: 2000
                                        // })

                                    })
                                } else if (res.data == 0) {                  //如果文件已存在
                                    wx.showToast({
                                        title: 'success',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    that.getfilelist();
                                } else {
                                    wx.showToast({
                                        title: 'error',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    that.getfilelist();
                                }
                            }
                        })
                    }
                })


            }
        })

    },

    showadd: function () {                  //判断是否显示添加按钮
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
    download: function (e) {            //下载文件
        var that = this
        var url = wx.getStorageSync('url')
        var md5 = e.currentTarget.dataset.md5
        var filename = e.currentTarget.dataset.filename
        var filepath = wx.env.USER_DATA_PATH + '/' + md5 + filename
        var size = e.currentTarget.dataset.size
        var time = e.currentTarget.dataset.time

        if (parseInt(size) >= 200000000) {
            wx.showModal({
                title: '文件过大，无法下载',
                content: '点击确定复制下载链接，然后前往浏览器下载',
                success(res) {
                    if (res.confirm) {
                        wx.setClipboardData({
                            data: url + 'file/bigfile/?md5=' + md5 + '&filename=' + filename,
                            success(res) {
                                wx.showToast({
                                    title: '复制成功',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    }
                }
            })
        } else if (parseInt(size) < 200000000) {
            var list = that.data.filelist
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].md5 == md5 && list[i].time == time) {
                            var fno = i
                        }
                    }
            wx.getFileSystemManager().access({
                path: filepath,
                success(res) {
                    that.setData({
                        ['filelist[' + fno + '].isdown']: '已下载'
                    })
                    wx.showToast({
                        title: '文件已下载',
                        icon: 'none',
                        duration: 2000
                    })
                    wx.openDocument({
                        filePath: filepath,
                        showMenu: true, //关键点
                        success: function (res) {
                            console.log('打开文档成功')
                        }
                    })
                },
                fail(res) {
                    
                    const download = wx.downloadFile({
                        url: url + 'file/download/?md5=' + md5,
                        filePath: filepath,
                        success(res) {

                            wx.openDocument({
                                filePath: filepath,
                                showMenu: true, //关键点
                                success: function (res) {
                                    console.log('打开文档成功')
                                }
                            })
                        },
                        fail(res) {
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                    download.onProgressUpdate((res) => {
                        if (res.progress == 100) {
                            that.setData({
                                ['filelist[' + fno + '].isdown']: '已下载'
                            })
                            wx.showToast({
                                title: '下载完成',
                                icon: 'none',
                                duration: 2000
                            })
                        } else {

                            that.setData({
                                ['filelist[' + fno + '].isdown']: '下载中：' + res.progress + '%'
                            })
                        }
                    })
                }
            })
        } else {
            wx.showToast({
                title: 'error',
                icon: 'none',
                duration: 2000
            })
        }
    },
    delfile: function (e) {             //删除文件
        var mylevel = wx.getStorageSync("mylevel")
        if (mylevel == 1 || mylevel == 2) {
            var that = this
            var url = wx.getStorageSync('url')
            var md5 = e.currentTarget.dataset.md5
            var classid = wx.getStorageSync('classid')
            var time = e.currentTarget.dataset.time
            wx.showModal({
                title: '提示',
                content: '确定删除文件吗？',
                success(res) {
                    if (res.confirm) {
                        wx.request({
                            url: url + 'file/deletefile/',
                            data: {
                                'md5': md5,
                                'classid': classid,
                                'time': time,
                            },
                            success(res) {
                                if (res.data == 1) {
                                    wx.showToast({
                                        title: '删除成功',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    that.getfilelist();
                                } else {
                                    wx.showToast({
                                        title: '删除失败',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            },
                            fail(res) {
                                wx.showToast({
                                    title: '删除失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    }


                }
            })
        } else {
            wx.showToast({
                title: '权限不足',
                icon: 'none',
                duration: 2000
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */

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