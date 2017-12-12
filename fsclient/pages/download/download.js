// pages/download/download.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preview_pic: "../../art/original_pic.png",
        images: {},
        download_server: "http://47.52.157.224:80/downloadFile/",
        token_limit: 30,
        input_token: ""
    },

    imageLoad: function (e) {
        var $width = e.detail.width,    //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height;    //图片的真实宽高比例
        var viewWidth = $width > 718 ? 718 : $width,
            viewHeight = viewWidth / ratio;    //计算的高度值
        var image = this.data.images;
        console.log("src width: " + $width)
        console.log("src height: " + $height)
        console.log("view width: " + viewWidth)
        console.log("view width: " + viewHeight)
        //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
        image[e.target.dataset.index] = {
            width: viewWidth,
            height: viewHeight
        }
        this.setData({
            images: image
        })
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

    },

    bindKeyInput: function (e) {
        this.setData({
            input_token: e.detail.value
        })
        console.log(this.data.input_token)
    },
    
    download: function() {
        let _this = this
        let downloadTask = wx.downloadFile({
            url: _this.data.download_server + "?token=" + _this.data.input_token,
            success: function (res) {
                console.log("success")
                console.log(res)
                var filePath = res.tempFilePath 
                _this.setData({
                    preview_pic: filePath
                })
                if (res.statusCode == 200) {
                    wx.getImageInfo({
                        src: filePath,
                        success: function (res) {
                            console.log(res)
                            var path = res.path;
                            wx.saveImageToPhotosAlbum({
                                filePath: path,
                                success(res) {
                                    console.log("saved");

                                    wx.showToast({
                                        title: '保存成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                }
                            })
                        }
                    })
                }
                wx.openDocument({
                    filePath: filePath,
                    success: function (res) {
                        console.log('打开文档成功')
                    },
                    fail: function (res) {
                        console.log('打开文档失败')
                    },
                })
            },
            fail: function (err) {
                console.log("failure")
                console.log(err)
                wx.showToast({
                    title: '下载失败！',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })


    }
})