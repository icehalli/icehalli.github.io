console.log('exp index');

class _Page {
    static json = null;
    static scriptDefinition = null;
    static styleDefinition = null;
    static waitForLoadedScripts = {};
    static waitForLoadedStyles = {};
    static externalStyleCount = 0;
    static externalScriptCount = 0;
    static Initialize(){
        _Ajax.get('index.json', _Page.Definition, _Page.DefinitionFallback);
    }

    static DefinitionFallback() {
        return {
            "scripts": {
                "jquery": null,
                "bootstrap": null,
                "markdown-it": null,
                "markdown-it-emoji": null,
                "util": {
                    "src": "scripts/exp/util.js",
                    "disabled": false
                }
            },
            "styles": {
                "bootstrap": null
            }
        }
    }
    static Definition(data){
        var error = '';
        // if(typeof data === 'object' && data.fail) {
        //     console.log(data.err.statusText, data.err);
        //     error = 'Error in get Definition file';
        //     data = {
        //         "scripts": {
        //             "util": {
        //                 "src": "scripts/exp/util.js",
        //                 "disabled": true
        //             },
        //             "jquery": {
        //                 "src": "https://code.jquery.com/jquery-3.7.1.min.js",
        //                 "integrity": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=",
        //                 "crossorigin": "anonymous"
        //             }
        //         },
        //         "styles": {
        //             "bootstrap": null
        //         }
        //     }
        //     //return;
        // }
        _Page.json = data;
        _Page.scriptDefinition = _Page.json.scripts;
        _Page.styleDefinition = _Page.json.styles;
        console.log('_Page.json', _Page.json);
        _Page.LoadResources();
    }
    static LoadResources(){
        _Page.FixPaths();
        _Page.LoadStyles();
        _Page.LoadScripts();
    }

    static FixPaths(){
        var scriptsKeys = Object.keys(_Page.scriptDefinition);
        var styleKeys = Object.keys(_Page.styleDefinition);
        var root = _Page.Root();
        console.log('root', root);

        for(var key of scriptsKeys) {
            if(!_Page.scriptDefinition[key])
                _Page.scriptDefinition[key] = _Page.GetScript(key);
            if(_Page.scriptDefinition[key].src.indexOf('http') < 0) {// local script
                _Page.scriptDefinition[key].src = root + _Page.scriptDefinition[key].src;
                _Page.scriptDefinition[key].scriptType = 'local';
            }
            else {
                _Page.externalScriptCount++;
                _Page.scriptDefinition[key].scriptType = 'cdn';
            }
        }
        for(var key of styleKeys) {
            if(!_Page.styleDefinition[key])
                _Page.styleDefinition[key] = _Page.GetStyle(key);
            if(_Page.styleDefinition[key].href.indexOf('http') < 0) {// local script
                _Page.styleDefinition[key].href = root + _Page.styleDefinition[key].href;            
                _Page.styleDefinition[key].resourceType = 'local';
            }
            else {
                _Page.externalStyleCount++;
                _Page.styleDefinition[key].resourceType = 'cdn';
            }
        }
        console.log('_Page.scriptDefinition', _Page.scriptDefinition);
        console.log('_Page.styleDefinition', _Page.styleDefinition);
    }


    
    static LoadScripts(){
        var scriptsKeys = Object.keys(_Page.scriptDefinition);
        if(_Page.externalScriptCount > 0){
            window.addEventListener("scriptsLoaded", (e) => {
                _Page.ApplyWaitingScripts();
            });
        }
        for(var key of scriptsKeys) {
            var scriptDef = _Page.scriptDefinition[key];
            _Page.AddScript(key, scriptDef);
        }
    }

    static LoadStyles(){        
        var keys = Object.keys(_Page.styleDefinition);
        if(_Page.externalStyleCount > 0){
            window.addEventListener("stylesLoaded", (e) => {
                console.log('stylesLoaded');
                _Page.ApplyWaitingStyles();
            });
        }
        for(var key of keys) {
            var scriptDef = _Page.styleDefinition[key];
            _Page.AddStyle(key, scriptDef);
        }
    }
    static ApplyWaitingStyles(){
        var scriptsKeys = Object.keys(_Page.waitForLoadedStyles);
        for(var i of scriptsKeys) {
            var scriptDef = _Page.waitForLoadedStyles[i];
            _Page.AddStyle(i, scriptDef);
        }
    }
    static ApplyWaitingScripts(){
        var scriptsKeys = Object.keys(_Page.waitForLoadedScripts);
        for(var i of scriptsKeys) {
            var scriptDef = _Page.waitForLoadedScripts[i];
            _Page.AddScript(i, scriptDef);

        }
    }
    static AddScript(key, scriptDef){     
        console.log('AddScript', key); 
        if(scriptDef.disabled)
            console.warn(`${key} script disabled`)  
        else if(scriptDef.resourceType === 'cdn') { //external script
            _Page.AddScriptToDom(scriptDef)
        }
        else {    
            _Page.waitForLoadedScripts[key] = scriptDef;
        }
    }
    static AddStyle(key, scriptDef){     
        console.log('AddStyle', key); 
        if(scriptDef.disabled)
            console.warn(`${key} style disabled`)  
        else if(scriptDef.resourceType === 'cdn') { //external style
            _Page.AddStyleToDom(scriptDef)
        }
        else {    
            _Page.waitForLoadedStyles[key] = scriptDef;
        }
    }
    
    static AddLocalScriptToDom(key, scriptDef){
        let scriptEle = document.createElement("script");
        let scriptKeys = Object.keys(scriptDef);
        for(let k of scriptKeys){
            scriptEle.setAttribute(k, scriptDef[k]);
        }
        document.body.appendChild(scriptEle);
        scriptEle.addEventListener("load", () => {
            _Page.ScriptLocalLoaded(key, scriptDef);
        });
        
        scriptEle.addEventListener("error", (ev) => {
            console.log("Error on loading file", key, ev);
        });
    }

    static ScriptLocalLoaded(key, scriptDef){
        console.log('ScriptLocalLoaded', key);
    }
    static AddScriptToDom(scriptDef){
        console.log('AddScriptToDom', scriptDef);
        let scriptEle = document.createElement("script");
        let scriptKeys = Object.keys(scriptDef);
        for(let k of scriptKeys){
            scriptEle.setAttribute(k, scriptDef[k]);
        }
        document.body.appendChild(scriptEle);
        scriptEle.addEventListener("load", () => {
            _Page.ScriptLoaded(scriptDef);
        });
        
        scriptEle.addEventListener("error", (ev) => {
            console.log("Error on loading file", ev);
        });
    }
    static AddStyleToDom(scriptDef){
        console.log('AddStyleToDom', scriptDef);
        let scriptEle = document.createElement("link");
        let scriptKeys = Object.keys(scriptDef);
        for(let k of scriptKeys){
            scriptEle.setAttribute(k, scriptDef[k]);
        }
        document.head.appendChild(scriptEle);
        scriptEle.addEventListener("styleload", () => {
            _Page.StyleLoaded(scriptDef);
        });
        
        scriptEle.addEventListener("styleerror", (ev) => {
            console.log("Error on loading file", ev);
        });
    }
    static StyleLoaded(scriptDef){
        console.log("Style loaded", scriptDef.src);
        _Page.externalStyleCount--;
        if(_Page.externalStyleCount === 0) {
            const event = new CustomEvent("stylesLoaded", { detail: new Date() });
            dispatchEvent(event);
        }
    }
    static ScriptLoaded(scriptDef){
        console.log("Script loaded", scriptDef.src);
        _Page.externalScriptCount--;
        if(_Page.externalScriptCount === 0) {
            const event = new CustomEvent("scriptsLoaded", { detail: new Date() });
            dispatchEvent(event);
        }
    }
    // static ApplyStyle(s) {
    //     console.log('ApplyStyle');
    //     let div = document.createElement("style");
    //     div.innerHTML = s;
    //     let head = document.getElementsByTagName('head')[0];
    //     head.appendChild(div);
    // }
    // static ApplyScript(s) {
    //     console.log('ApplyScript');
    //     window.eval(s);
    // }

    static Root(){
        let r = new URL(window.location.href);
        console.log('root', r);
        if(r.origin === 'file://')
            return 'file:///C:/dev/icehalli/icehalli.github.io/docs/';
        return r.protocol + '//' + r.host + '/' + r.pathname.split('/')[1] + '/'
        // https://icehalli.github.io/docs/something/
    }

    static GetScript(key){
        let fixed = _Page.GetFixedScripts();
        let fixedKeys = Object.keys(fixed);
        if(fixedKeys.indexOf(key) > -1){
            return fixed[key];
        }
        return null;
    }
    static GetStyle(key){
        let fixed = _Page.GetFixedStyles();
        let fixedKeys = Object.keys(fixed);
        if(fixedKeys.indexOf(key) > -1){
            return fixed[key];
        }
        return null;
    }

    static GetFixedScripts() {
        return {
            "jquery": {
                "src": "https://code.jquery.com/jquery-3.7.1.min.js",
                "integrity": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=",
                "crossorigin": "anonymous"
            },
            "bootstrap": {
                "src": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                "integrity": "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
                "crossorigin": "anonymous"
            },
            "markdown-it": {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js",
                "integrity": "sha512-ohlWmsCxOu0bph1om5eDL0jm/83eH09fvqLDhiEdiqfDeJbEvz4FSbeY0gLJSVJwQAp0laRhTXbUQG+ZUuifUQ==",
                "crossorigin": "anonymous",
                "referrerpolicy": "no-referrer"
            },
            "markdown-it-emoji": {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it-emoji/3.0.0/markdown-it-emoji.min.js",
                "integrity": "sha512-oEGO1WEAe1nZqI4pvhThiGh3IPUKfmelFhGR0PEOwv9kecA/dJ6FA67Qq8H6T+p/e4rh+lx2T3X7FnWVbYM1DA==",
                "crossorigin": "anonymous",
                "referrerpolicy": "no-referrer"
            }
        }
    }
    
    static GetFixedStyles() {
        return {
            "bootstrap": {
                "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
                "rel": "stylesheet",
                "integrity": "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
                "crossorigin": "anonymous"
            }
        }
    }

}
class _Ajax {
    static getInFolder(url, cb) {
        if(_Config.isMock)
            this.get(url,cb);
        else
            this.get(_Config.folder + '/' + url);
    }
    
    static getAsync = async(url, fallbackData) => {
        // const response = await fetch(url);
        // console.log(response);
        let json;

        try {
            const response = await fetch(url);
            json = await response.json();
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Unexpected token < in JSON
                console.log('There was a SyntaxError', error);
            } else {
                console.log('There was an error', error);
            }
            if(fallbackData) {
                const data = fallbackData();
                console.log('Using fallback data', data);
                json = data;
            }
            else
                json = {fail:true, err};
        }

        if (json) {
            console.log('Valid response', json);
        }
        return json;
    }

    static getdd(url, cb, fallbackData) {
        console.log('_Ajax.get', url)
        fetch(url)
            .then((response) => response.json(), (err) => {
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    cb(data);
                }
                else
                    cb({fail:true, err});
            })
            .then((json) => {
                cb(json);
            });
    }

    
    static get(url, cb, fallbackData) {
        console.log('_Ajax.get', url)
        fetch(url)
            .then((response) => response.json(),
            function(err) {
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    return data;
                }
                else
                    return {fail:true, err};
            })
            .then((json) => {
                if(!cb) {
                    console.log('no cb', cb);
                }
                else
                    cb(json);
            });
    }

    static get4(url, cb, fallbackData) {
        fetch(url)
            .then(function(data){
                cb(data);
            }, function(err){
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    cb(data);
                }
                else
                    cb({fail:true, err});
            });
    }
    static get2(url, cb) {
        $.get(url, function( data ) {
            if(cb)
                cb(data);
        });
    }

    static get3(url, cb) {
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