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
    $('#nav-drawer-gray-layer')[this.tapevent](function() {
        $(this).addClass('close');
        $('#nav-drawer').addClass('close');
        $('#nav-bar-btn').removeClass('active');
        setTimeout(function() {
            $('#nav-drawer-gray-layer').addClass('realclose');
        }, 200);
        that.status = false;
    });
    $('#nav-bar-btn')[this.tapevent](function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.status) {
            // 现在为打开状态，需要关闭
            $(this).removeClass('active');
            $('#nav-drawer-gray-layer').addClass('close');
            $('#nav-drawer').addClass('close');
            setTimeout(function() {
                $('#nav-drawer-gray-layer').addClass('realclose');
            }, 200);
        } else {
            $(this).addClass('active');
            $('#nav-drawer-gray-layer').removeClass('realclose').removeClass('close');
            $('#nav-drawer').removeClass('close');
        }
        that.status = !that.status;
    });
};

$(document).ready(function() {
    nav = new Nav();
});

