console.log('index.js');
class _Global {
    static initialize() {
        _Config.urlDetection();
        _Global.url = window.location.href;
        document.title = _Config.title;
    }
}

class _Config {
    static url = null;
    static isMock = false;
    static title = '';

    static urlDetection() {
        _Config.url = new URL(window.location.href);
        _Config.isMock = _Config.url.origin === 'file://';
        _Config.title = _Url.last(_Config.url);
        _Config.title = _Utils.upperCaseFirst(_Config.title);
    }
}

class _Url {
    static last(uriObject) {
        const parts = uriObject.pathname.split('/');
        const last = parts[parts.length -1];
        if(last.length > 1) {
            const res = last.split('.')[0];
            if(res === 'index')
                return parts[parts.length -2];
            return res;
        }
        return last;        
    }
}

class _Utils {
    static upperCaseFirst(str) {        
        return str.charAt(0).toUpperCase() + str.slice(1);

    }
}

_Global.initialize();