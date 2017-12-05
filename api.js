const host = 'https://cnodejs.org/api/v1/'

module.exports = {
	user:{
		login: host + 'accesstoken',
		detail: host + 'user/',
	},
	topic: {
		list: host + 'topics',
		create: host + 'topics',
		update: host + 'topics/update',
		detail: host + 'topic/',
		collect: {
			list: host + 'topic_collect/', // + loginname
			create: host + 'topic_collect/collect',
			cancel: host + 'topic_collect/de_collect'
		},
		reply: {
			create: host + 'topic/',
			ups: host + 'reply/'
		}
	},
	message: {
		unRead: host + 'message/count',
		list: host + 'messages',
		mark: {
			all: host + 'message/mark_all',
			one: host + 'message/mark_one/'	
		}
	}
}