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
    
    this.closeDrawer = function() {
        $('#nav-drawer-gray-layer').addClass('close');
        $('#nav-drawer').addClass('close');
        $('#nav-bar-btn').removeClass('active');
        setTimeout(function() {
            $('#nav-drawer-gray-layer').addClass('realclose');
        }, 200);
        that.status = false;
    };
    this.openDrawer = function() {
        $('#nav-drawer-gray-layer').removeClass('realclose').removeClass('close');
        $('#nav-drawer').removeClass('close');
        $('#nav-bar-btn').addClass('active');
        that.status = true;
    };
    $('#nav-drawer-gray-layer')[this.tapevent](this.closeDrawer);
    $('#nav-bar-btn')[this.tapevent](function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.status) {
            // 现在为打开状态，需要关闭
            that.closeDrawer();
        } else {
            that.openDrawer();
        }
    });
    $('.drawer-btn').bind('click', function() {
        that.closeDrawer();
    });
};

$(document).ready(function() {
    nav = new Nav();
});

