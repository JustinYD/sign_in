/* eslint-disable handle-callback-err */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable indent */
// const host = 'http://192.168.0.115:5000'
const host = 'http://192.168.1.223:5000'

function request(url, method, data, header = {}) {
    wx.showLoading({
        title: '加载中' //数据请求前loading
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url, // 仅为示例，并非真实的接口地址
            method: method,
            data: data,
            headers: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                wx.hideLoading()
                resolve(res.data)
            },
            fail: function(error) {
                wx.hideLoading()
                wx.showToast({
                    title: '服务器连接失败', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true
                })
                reject(false)
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    })
}

function get(obj) {
    return request(obj.url, 'GET', obj.data)
}

function post(obj) {
    return request(obj.url, 'POST', obj.data)
}

export default {
    request,
    get,
    post,
    host
}