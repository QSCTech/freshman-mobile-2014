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
            'background-image': 'url(' + url + ')',
            'background-size': 'auto ' + that.sheight * 1.2 + 'px',
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
        that.y = beta * 2 - 100;
        that.x = gamma * 2 - 100;
        that.obj.css({
            'background-position-x': that.x,
            'background-position-y': that.y
        });
    };
    this.startDeviceOrientation = function() {
        setInterval(function() {
            console.log('beta = ' + that.beta + ', gamma = ' + that.gamma);
        }, 1000);
        window.addEventListener('deviceorientation', that.checkDeviceOrientation);
    };
    this.stopDeviceOrientation = function() {
        window.addEventListener('deviceorientation');
    };
};

