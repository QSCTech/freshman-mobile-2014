/**
 * @overview Background image tricks for freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var Bgimg = function() {
    var that = this;
    this.sheight = screen.availHeight;
    this.swidth = screen.availWidth;
    
    this.setBackground = function(obj, url) {
        that.preloader = $('<img>').attr('src', url);
        that.obj = $(obj);
        $(obj).css({
            'background': 'url(' + url + ') no-repeat',
            'background-size': 'auto ' + that.swidth * 1.3 + 'px',
        });
    };
    this.checkDeviceOrientation = function(event) {
        var alpha, beta, gamma;
        alpha = event.alpha;
        beta = event.beta;
        gamma = event.gamma;
        that.alpha = alpha;
        that.beta = beta;
        that.gamma = gamma;
        that.x = beta - that.swidth / 2;
        that.y = gamma - that.sheight / 2;
        that.obj.css({
            'background-position-x': that.x,
            'background-position-y': that.y
        });
    };
    this.startDeviceOrientation = function() {
        window.addEventListener('deviceorientation', that.checkDeviceOrientation);
    };
    this.stopDeviceOrientation = function() {
        window.addEventListener('deviceorientation');
    };
};

