console.log('index.js');
class _Global {
    static isOnline = false;
    static isMock = false;
    static online() {
        return window.location.href.indexOf('C:') === -1;
    }
}

_Global.isOnline = _Global.online();
_Global.isMock = !_Global.isOnline;