console.log('util.js');
$(`body`).append(`Localscript`);


class _Config {
    static url = null;
    static isMock = false;
    static title = '';
    static folder = '';

    static urlDetection(url) {
        //debugger;
        _Config.url = new URL(url);
        _Config.isMock = _Config.url.origin === 'file://';
        _Config.title = _Url.last(_Config.url);
        _Config.title = _Utils.upperCaseFirst(_Config.title);
        let last = _Config.url.pathname.split('/');
        last = last[last.length-1];
        _Config.folder = this.getPart(_Config.url.pathname, 'docs/', '/' + last);
    }
    static getPart(str, a, b) {
        var mySubString = str.substring(
            str.indexOf(a) + a.length, 
            str.lastIndexOf(b)
        );
        return mySubString;
    }
}

class _Url_Tests {
    static success = true;
    static test() {
        const file_root = "file:///C:/dev/icehalli/icehalli.github.io/docs/index.html";
        _Config.urlDetection(file_root);
        if(_Config.folder !== '/') {
            success = false;
            console.error(file_root, 'folder fail');
        }

        console.info('TEST SUCCESSFUL:', this.success)
    }
}

class _Url {
    static last(uriObject) {
        const parts = uriObject.pathname.split('/');
        const last = parts[parts.length -1];
        if(last === '' || last === 'index.html')
            return parts[parts.length - 2] + ' - index'; //folder        
        const res = last.split('.')[0];
        return res;     
    }
}

class _Utils {
    static upperCaseFirst(str) {        
        return str.charAt(0).toUpperCase() + str.slice(1);

    }
}
_Config.urlDetection(window.location.href);