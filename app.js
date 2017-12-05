App({
	onLaunch() {

	},
	_: {},

	checkLogin(data) {
		if (data.hasOwnProperty('accesstoken') && !data.accesstoken) {
			wx.showToast({
				title: '你还没有登入',
				image: '/assets/images/error.png'
			})
			return false
		}
		return true
	},

	http(method, url, data, cb) {
		if (this.checkLogin(data)) {
			wx.request({
				url: url,
				method: method,
				data: data,
				header: { 'content-type': 'application/json' },
				success: res => {
					typeof cb === "function" && cb(res.data)
				},
				fail: res => {
					console.log(res)
					if (res) {
						wx.showToast({
							image: '/assets/images/error.png',
							title: ':-)',
						})
					}
				}
			})
		}
	},
	get(url, data, cb) {
		this.http('GET', url, data, cb)
	},
	post(url, data, cb) {
		this.http('POST', url, data, cb)
	}
})