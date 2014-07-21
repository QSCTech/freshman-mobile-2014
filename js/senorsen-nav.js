/**
 * @overview Senorsen's navigation bar of freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var Nav = function() {
    var that = this;
    this.status = false;
    this.tapevent = 'click';
    if (window.supportsTouch) this.tapevent = 'tap';
    $('#nav-bar-btn')[this.tapevent](function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.status) {
            // 现在为打开状态，需要关闭
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        that.status = !that.status;
    });
};

$(document).ready(function() {
    nav = new Nav();
});

