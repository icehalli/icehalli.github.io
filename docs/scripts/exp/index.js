console.log('exp index');

class _Page {
    static json = null;
    static scriptDefinition = null;
    static waitForLoadedScripts = {};
    static externalScriptCount = 0;
    static Initialize(){
        //$(document).ready(function(){
        _Ajax.get('index.json', _Page.Definition, _Page.DefinitionFallback);        
        //}); 
    }
    static DefinitionFallback() {
        return {
            "scripts": {
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
                },
                "util": {
                    "src": "scripts/exp/util.js",
                    "disabled": false
                }
            }
        }
    }
    static Definition(data){
        var error = '';
        if(typeof data === 'object' && data.fail) {
            console.log(data.err.statusText, data.err);
            error = 'Error in get Definition file';
            data = {
                "scripts": {
                    "util": {
                        "src": "scripts/exp/util.js",
                        "disabled": true
                    },
                    "jquery": {
                        "src": "https://code.jquery.com/jquery-3.7.1.min.js",
                        "integrity": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=",
                        "crossorigin": "anonymous"
                    }
                }
            }
            //return;
        }
        _Page.json = data;
        var scriptsKeys = Object.keys(data.scripts);
        _Page.scriptDefinition = data.scripts;
        console.log('scripts', scriptsKeys);
        
        for(var i of scriptsKeys) {
            var scriptDef = data.scripts[i];
            if(scriptDef.integrity)
                _Page.externalScriptCount++;
        }
        for(var i of scriptsKeys) {
            var scriptDef = data.scripts[i];
            // console.log('scriptDef', scriptDef);
            _Page.AddScript(i, scriptDef);

        }
        console.log('_Page.externalScriptCount', _Page.externalScriptCount);
        if(_Page.externalScriptCount > 0){
            console.log('listening to scriptsLoaded');
            window.addEventListener("scriptsLoaded", (e) => {
                console.log('scriptsLoaded');
                _Page.ApplyWaitingScripts();
            });
        }
        // console.log(_Page.Root());
        // console.log(_Page.json);
    }
    static ApplyWaitingScripts(){
        var scriptsKeys = Object.keys(_Page.waitForLoadedScripts);
        console.log('waitForLoadedScripts', scriptsKeys);
        var root = _Page.Root();
        for(var i of scriptsKeys) {
            var scriptDef = _Page.waitForLoadedScripts[i];
            _Ajax.get(root + scriptDef.src, _Page.ApplyScript, function(){
                return '$(`body`).append(`Localscript`);';
            });

        }
    }
    static AddScript(key, scriptDef){     
        console.log('AddScript', key, scriptDef); 
        if(scriptDef.disabled)
            console.warn(`${key} script disabled`)  
        else if(scriptDef.integrity) {
            _Page.AddScriptToDom(scriptDef)
        }
        else {    
            _Page.waitForLoadedScripts[key] = scriptDef;
            // var root = _Page.Root();
            // _Ajax.get(root + scriptDef.src, _Page.ApplyScript, function(){
            //     return '$(`body`).append(`Localscript`);';
            // });
        }

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
    static ScriptLoaded(scriptDef){
        console.log("File loaded");
        let div = document.createElement("div");
        div.innerHTML = `${scriptDef.src} added`;
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(div);
        //$('body').append(`${scriptDef.src} added`);
        _Page.externalScriptCount--;
        console.log('externalScriptCount', _Page.externalScriptCount);
        if(_Page.externalScriptCount === 0) {
            const event = new CustomEvent("scriptsLoaded", { detail: new Date() });
            dispatchEvent(event);
        }
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
    
    static get(url, cb, fallbackData) {
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