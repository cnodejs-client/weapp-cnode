module.exports = {
  showToast(title, timeout) {
    var toast = this.data.toast || {};
    clearTimeout(toast.timer);

    // 弹层设置~
    toast = {
      show: true,
      title
    };
    this.setData({
      toast
    });

    var timer = setTimeout(() => {
      this.cleartoast();
    }, timeout || 3000);

    this.setData({
      'toast.timer': timer
    });
  },

  clearToast() {
    var toast = this.data.toast || {};
    clearTimeout(toast.timer);

    this.setData({
      'toast.show': false
    });
  }
};