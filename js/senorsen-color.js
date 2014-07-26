/**
 * @overview Color calculator for freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

String.prototype.hexRgb = function(retarr) {
    var that = this,
        hex, 
        newhex = '';
    try {
       hex = this.split('#')[1].toLocaleLowerCase();
    } catch (e) {
        return this;
    }
    // 可能有3位十六进制或者6位十六进制
    var regexps = [/^[0-9a-f]{3}$/, /^[0-9a-f]{6}$/];
    if (regexps[1].test(hex)) {
        newhex = hex;
    } else if (regexps[0].test(hex)) {
        newhex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    } else {
        // 直接return了吧
        return this;
    }
    var hr, hg, hb, r, g, b;
    hr = newhex.charAt(0) + newhex.charAt(1);
    hg = newhex.charAt(2) + newhex.charAt(3);
    hb = newhex.charAt(4) + newhex.charAt(5);
    r = parseInt('0x' + hr);
    g = parseInt('0x' + hg);
    b = parseInt('0x' + hb);
    if (retarr) {
        return [r, g, b];
    }
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};

String.prototype.hexRgba = function(a) {
    var rgb = this.hexRgb(true);
    if (!$.isArray(rgb)) {
        rgb = this.parseRgb();
    }
    var r = rgb[0], g = rgb[1], b = rgb[2];
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

String.prototype.hexRgbFade = function(a) {
    // somewhat for performance enhancement
    var rgb = this.hexRgb(true);
    if (!$.isArray(rgb)) {
        rgb = this.parseRgb();
    }
    // 人眼色彩误差暂不记（实际上是我忘记了参数）
    a = parseFloat(a);
    var r = 255 - (255 - rgb[0]) * a,
        g = 255 - (255 - rgb[1]) * a,
        b = 255 - (255 - rgb[2]) * a;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};

String.prototype.parseRgb = function() {
    var regexp = /^rgb\((\d+),\s?(\d+),\s?(\d+)\)$/,
        regexpa = /^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(.+)\)$/;
    var r;
    var str = this.toLowerCase();
    if (regexp.test(str)) {
        r = regexp.exec(str);
        return [r[1], r[2], r[3]];
    } else if (regexpa.test(str)) {
        r = regexpa.exec(str);
        return [255 - (255 - parseInt(r[1])) * parseFloat(r[4]), 
                255 - (255 - parseInt(r[2])) * parseFloat(r[4]), 
                255 - (255 - parseInt(r[3])) * parseFloat(r[4])];
    } else {
        return false;
    }
};

