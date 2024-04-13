console.log('exp index');

class _Page {
    static json = null;
    static Initialize(){
        $(document).ready(function(){
            _Ajax.get('index.json', _Page.Definition);        
        }); 
    }
    static Definition(data){
        var error = false;
        if(typeof data === 'object' && data.fail) {
            console.log(data.err.statusText, data.err);
            error = true;
            data = {
                "scripts": {
                    "a": "scripts/exp/util.js"
                }
            }
            //return;
        }
        _Page.json = data;
        var root = _Page.Root();
        var scriptsKeys = Object.keys(data.scripts);
        for(var i of scriptsKeys) {
            var ss = root + data.scripts[i];
            console.log(ss);
            if(error)
                _Page.ApplyScript('console.log("mocking")');
            else
                _Ajax.get(ss, _Page.ApplyScript);

        }
        console.log(_Page.Root());
        console.log(_Page.json);
    }
    static ApplyScript(s) {
        console.log('ApplyScript');
        window.eval(s);
    }

    static Root(){
        let r = new URL(window.location.href);
        return r.protocol + '//' + r.host + '/' + r.pathname.split('/')[1] + '/'
        // https://icehalli.github.io/docs/something/
    }
}
class _Ajax {
    static getInFolder(url, cb) {
        if(_Config.isMock)
            this.get(url,cb);
        else
            this.get(_Config.folder + '/' + url);
    }
    static get2(url, cb) {
        $.get(url, function( data ) {
            if(cb)
                cb(data);
        });
    }

    static get(url, cb) {
        $.ajax(url)
            .done(function(data) {
                cb(data);
            })
            .fail(function(err) {
                cb({fail:true, err});
            })
            .always(function() {
                //alert( "complete" );
            });
    }
}
_Page.Initialize();