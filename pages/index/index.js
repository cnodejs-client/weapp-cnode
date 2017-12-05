const app = getApp()
const Api = require('../../api')

let p = 0, t = 0, down = true, up = false
const size = 10

Page({
	data: {
		tab: 0,
		page: [1, 1, 1, 1],
		isCompleted: [false, false, false, false],
		topics: [[], [], [], []],
		tabs: [
			{ text: '问答', tab: 0, feild: 'ask' },
			{ text: '分享', tab: 1, feild: 'share' },
			{ text: '招聘', tab: 2, feild: 'job' },
			{ text: '精华', tab: 3, feild: 'good' }
		],
		nav: false,
		isBottom: false,
		isPullDown: true,
		winHeight: wx.getSystemInfoSync().windowHeight,
		accessToken: wx.getStorageSync('access_token').length < 1 ? false : wx.getStorageSync('access_token')
	},
	onLoad(option) {
		this.setData({ winHeight: wx.getSystemInfoSync().windowHeight })
		if (option.tab) this.setData({ tab: option.tab })
		let topics = this.data.topics, tab = this.data.tab
		this.getTopicData(res => {
			topics[tab] = res
			this.setData({ topics: topics })
		})
		this.getUserInfo(this.data.accessToken)
	},

	onShow() {
		if (this.data.accessToken) {
			app.get(Api.message.unRead, {
				accesstoken: this.data.accessToken
			}, res => {
				this.setData({ unReadMsgCount: res.data })
			})
		}
	},

	getUserInfo(ak) {
		if (ak) {
			app.post(Api.user.login, {
				accesstoken: ak
			}, res => {
				if (res.success) {
					this.setData({ user: res })
					app._ = Object.assign(app._, res)
				}
			})
		}
	},

	handleLogin() {
		wx.scanCode({
			success: res => {
				try {
					wx.setStorageSync('access_token', res.result)
					this.getUserInfo(res.result)
					this.setData({ accessToken: res.result })
					wx.showToast({ title: '登入成功' })
				} catch (e) {
					wx.showToast({ title: '登入失败', image: '/assets/images/error.png' })
				}
			},
			fail: _ => {
				wx.showToast({ title: '登入失败', image: '/assets/images/error.png' })
			}
		})
	},

	getTopicData(cb) {
		let tab = this.data.tab
		app.get(Api.topic.list, {
			page: this.data.page[tab],
			limit: size,
			tab: this.data.tabs[tab].feild
		}, res => {
			typeof cb === "function" && cb(res.success ? res.data : [])
		})
	},

	handleTabChange(e) {
		this.tabChangeToUpdateTopics(parseInt(e.currentTarget.dataset.tab))
	},

	switchContent(e) {
		this.tabChangeToUpdateTopics(parseInt(e.detail.current))
	},

	tabChangeToUpdateTopics(tab) {
		this.setData({ tab: tab }, _ => {
			let topics = this.data.topics
			// 第一次加载
			if (topics[tab].length === 0) {
				wx.showLoading({ mask: true })
				this.getTopicData(res => {
					topics[tab] = res
					this.setData({ topics: topics }, _ => {
						setTimeout(_ => { wx.hideLoading() }, 500)
					})
				})
			}
		})
	},

	handleReachBottom(e) {
		if (!this.data.isBottom) {
			let page = this.data.page, tab = this.data.tab
			page[tab] += 1
			this.setData({
				isBottom: true,
				page: page
			}, _ => {
				let topics = this.data.topics,
					isCompleted = this.data.isCompleted
				this.getTopicData(res => {
					topics[tab] = topics[tab].concat(res)
					isCompleted[tab] = res.length < size
					this.setData({
						topics: topics,
						isCompleted: isCompleted,
						isBottom: false
					})
				})
			})
		}
	},

	getScrollDirection(e) {
		p = e.detail.scrollTop
		if (t <= p) {
			if (down) {
				this.setData({ isPullDown: false })
				down = false
				up = true
			}
		} else {
			if (up) {
				this.setData({ isPullDown: true })
				down = true
				up = false
			}
		}
		setTimeout(_ => { t = p }, 0)
	},

	makeTopic(e) {
		if (!this.data.accessToken) {
			wx.showToast({
				image: '/assets/images/warn.png',
				title: '请先登录',
			})
			return false
		}
		wx.navigateTo({ url: '/pages/edit/edit?tab=' + this.data.tab })
	},

	getUserCenter(e) {
		wx.navigateTo({
			url: '/pages/user/user?loginname=' + e.currentTarget.dataset.loginname,
		})
	},

	getTopicDetail(e) {
		wx.navigateTo({
			url: '/pages/topic/topic?id=' + e.currentTarget.dataset.id,
		})
	},

	handleNavToggle() {
		this.setData({ nav: !this.data.nav })
	},

	handleLogout(e) {
		wx.showModal({
			title: '确定退出？',
			showCancel: true,
			success: res => {
				if (res.confirm) {
					wx.clearStorageSync()
					app._ = {}
					this.setData({
						accessToken: false, user: {}
					})
					wx.showToast({ title: '退出成功' })
				}
			}
		})
	},

	onShareAppMessage() {
		return {
			title: '【CNODE】' + this.data.tabs[this.data.tab].text,
			path: this.route + '?tab=' + this.data.tab
		}
	}
})