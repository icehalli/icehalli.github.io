console.log('index.js');
class _Global {
    static initialize() {
        _Config.urlDetection(window.location.href);//https://icehalli.github.io/docs/plans/
        document.title = _Config.title;
    }
}

class _Config {
    static url = null;
    static isMock = false;
    static title = '';

    static urlDetection(url) {
        _Config.url = new URL(url);
        _Config.isMock = _Config.url.origin === 'file://';
        _Config.title = _Url.last(_Config.url);
        _Config.title = _Utils.upperCaseFirst(_Config.title);
    }
}

class _Url {
    static last(uriObject) {
        const parts = uriObject.pathname.split('/');
        const last = parts[parts.length -1];
        if(last === '' || last === 'index.html')
            return parts[parts.length - 2] - 'index'; //folder        
        const res = last.split('.')[0];
        return res;     
    }
}

class _Utils {
    static upperCaseFirst(str) {        
        return str.charAt(0).toUpperCase() + str.slice(1);

    }
}

_Global.initialize();