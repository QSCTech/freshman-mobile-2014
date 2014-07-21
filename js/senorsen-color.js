/**
 * @overview Color calculator for freshman-zju-qsc
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

String.prototype.hexRgb = function(retarr) {
    var that = this,
        hex = this.split('#')[1].toLocaleLowerCase(),
        newhex = '';
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
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

