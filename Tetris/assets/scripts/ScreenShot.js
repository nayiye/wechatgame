
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    takePhoto() {
        if (typeof wx === 'undefined') {
            return;
        }

        // 获取当前屏幕截图，参数请参照文档自己设置
        let tempFilePath = canvas.toTempFilePathSync({
            x: 0,
            y: 0,
            fileType: 'jpg',
            quality: '1'
        });

        wx.authorize({
            scope: 'scope.writePhotosAlbum',   // 需要获取相册权限
            
            success: (res)=>{     
                // 将截图保存到相册中
                wx.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success: (res)=>{
                        wx.showToast({
                            title: '图片保存成功',
                            icon: 'success',
                            duration: 2000
                        });
                    },
                    fail: (res)=>{
                        console.log(res);
                        console.log('图片保存失败');
                    }
                });
            },

            fail: (res)=>{
                console.log('授权失败');
            }
        });
    }
});
