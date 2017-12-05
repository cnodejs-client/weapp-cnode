const app = getApp()
const Api = require('../../api')

Page({

	data: {

	},
	
	onLoad(options) {
		wx.showLoading({ })
		app.get(Api.user.detail + options.loginname, {}, res => {
			if (res.success) {
				this.setData({ user: res.data })
				wx.hideLoading()
			}
		})

		app.get(Api.topic.collect.list + options.loginname, {}, res => {
			res.success && this.setData({ topics: res.data })
		})
	},

	getUserCenter(e) {
		if (e.currentTarget.dataset.loginname !== this.data.user.loginname) {
			wx.navigateTo({
				url: '/pages/user/user?loginname=' + e.currentTarget.dataset.loginname,
			})
		}
	},

	getTopicDetail(e) {
		wx.navigateTo({
			url: '/pages/topic/topic?id=' + e.currentTarget.dataset.id,
		})
	},

	onShareAppMessage () {
		return {
			title: '【CNODE】' + this.data.user.loginname,
			path: this.route + '?loginname=' + this.data.user.loginname
		}
	}
})