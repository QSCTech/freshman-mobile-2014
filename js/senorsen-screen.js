/**
 * @overview get screen real pixel
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 **/

function getScreenWidth() {
    return window.devicePixelRatio
         ? window.devicePixelRatio * screen.availWidth
         : screen.availWidth;
}

function getScreenHeight() {
    return window.devicePixelRatio
         ? window.devicePixelRatio * screen.availHeight
         : screen.availHeight;
}

