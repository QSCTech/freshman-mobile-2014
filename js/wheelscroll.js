/**
 * @overview Mousewheel scroll for freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var Wheelscroll = function() {
    var that = this;
    
    // belows from: http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers 
    var wheelDistance = function(e) {
        if (!e) e = event;
        var wheelDelta = e.wheelDelta,
            detail = e.detail;
        if (detail) {
            if (wheelDelta) {
                return wheelDelta / detail / 40 * detail > 0 ? 1 : -1; // Opera
            } else {
                return - detail / 3; // Firefox
            }
        } else {
            return wheelDelta / 120;
        }
    };
    var wheelDirection = function(e) {
        if (!e) e = event;
        return (e.detail < 0) ? 1 : (e.wheelDelta > 0) ? 1 : -1;
    };
    // end 

    this.per = 50;
    var handleWheel = function(e) {
        var wd = wheelDirection(e);
        if (wd > 0) {
            this.scrollTop -= that.per;
        } else if (wd < 0) {
            this.scrollTop += that.per;
        }
    };
    this.setObject = function(obj) {
        $(obj).each(function() {
            this.addEventListener('mousewheel', handleWheel, false);
        });
    };
};


