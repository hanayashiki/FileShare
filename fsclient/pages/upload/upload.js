// pages/upload/upload.js
const config = require("../../utils/config.js")
const util = require("../../utils/util.js")

Page({

    /**
   * 页面的初始数据
   */
    data: {
        upload_server: "http://47.52.157.224:80/uploadFile/",
        preview_pic: "../../art/original_pic.png",
        images: {},
        default_token: "",
        set_input: "",
        user_token: "",
        selected: false,
        token_user_defined: false,
        token_limit: 30
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        this.setRandomToken()
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
        this.data.token_user_defined = true
        this.setData({
            user_token: e.detail.value
        })
        console.log(this.data.user_token)
    },

    setRandomToken: function() {
        if (!this.data.token_user_defined) {
            this.data.token_user_defined = true
            let _default_token = this.randomWord(true, 5, 5)
            let _user_token = _default_token
            this.setData({
                default_token: _default_token,
                user_token: _user_token
            })
            console.log("generated token: " + _default_token)
            this.setData(
                { 
                    set_input : "" 
                }
            )
        }
    },

    randomWord: function (randomFlag, min, max) {
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
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

    chooseImageTap: function () {
        let _this = this; 
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            success: function (res) {
                if (!res.cancel) {
                    _this.setRandomToken()
                    if (res.tapIndex == 0) {
                        _this.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        _this.chooseWxImage('camera')
                    }
                }
            }
        })
    },

    chooseWxImage: function (_type) {
        let _this = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [_type],
            success: function (res) {
                console.log(res)
                _this.setData(
                    {
                        selected: true,
                        preview_pic : res.tempFilePaths[0]
                    }
                )
            }
        })
    },

    uploadImage: function () {
        let _this = this;
        wx.uploadFile({
            url: _this.data.upload_server,
            filePath: _this.data.preview_pic,
            name: 'myfile',
            formData: {
                'token': _this.data.user_token
            },
            success: function (res) {
                _this.data.token_user_defined = false
                var data = res.data
                wx.showToast({
                    title: '上传成功！',
                    icon: 'success',
                    duration: 2000
                })
                console.log(data)
                //do something
            }
        })
    }

})