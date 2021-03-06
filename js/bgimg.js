/**
 * @overview Background image tricks for freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var Bgimg = function() {
    var that = this;
    this.sheight = getScreenHeight();
    this.swidth = getScreenWidth();

    this.setBackground = function(obj, url, startx, starty, xr, yr) {
        that.preloader = $('<img>').attr('src', url);
        that.obj = $(obj);
        $(obj).css({
            'background-image': 'url(' + url + ')',
            'background-size': 'cover',
        });
        startx = (typeof startx == 'undefined') ? 0 : startx;
        starty = (typeof starty == 'undefined') ? 0 : starty;
        this.startx = startx;
        this.starty = starty;
        xr = (typeof xr == 'undefined') ? 1 : xr;
        yr = (typeof yr == 'undefined') ? 1 : yr;
        this.xr = xr;
        this.yr = yr;
    };
    this.checkForMozilla = function(event) {
        that.checkDeviceOrientation({
            alpha: event.z * 180 + 180, // 不知道这对不对
            beta: event.y * 180,
            gamma: event.x * 90
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
        that.y = beta * 2;
        that.x = gamma * 2;
        that.obj.css({
            'background-position-x': that.x * that.xr + that.startx,
            'background-position-y': that.y * that.yr + that.starty
        });
    };
    this.startDeviceOrientation = function() {
        console.log('[Senorsen-bgimg] Device Orientation Started. ');
        window.addEventListener('deviceorientation', that.checkDeviceOrientation);
        window.addEventListener('MozOriention', that.checkForMozilla);
    };
    this.stopDeviceOrientation = function() {
        console.log('[Senorsen-bgimg] Device Orientation Stopped. ');
        window.removeEventListener('deviceorientation', that.checkDeviceOrientation);
        window.removeEventListener('MozOriention', that.checkForMozilla);
    };
};

