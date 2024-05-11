
let Context = null;

let Snippets = {};

function createSnippetPool(){
    //return; //notworking;
    const keys = Object.keys(Snippets);
    for(var snippetKey of keys){
        let snippet = Snippets[snippetKey];
        var ID = snippet.id.toUpperCase();
        //window.snippPool[ID] = ID;
        // Context.window[ID] = null;
        window.snippPool[ID] = new Object();
        snippet.Entry = window.snippPool[ID];//Context.window[ID];
    }
}

function isSnippetTrigger(snippetTriggers, trigger){
    let ts = snippetTriggers.split(',');
    return ts.indexOf(trigger) > -1;
}

export function addSnippetToEntry(id, snippet){
    return;
    // id = id.toUpperCase();
    if(!Snippets[id]) {
        console.error(id, 'snippet does not exist');
        return;
    }
    Snippets[id].Entry = snippet;
}

export function logSnippets(){
    console.log('Snippets'.toUpperCase(), Snippets);
}

export function loadSnippets(ctx) {
    NotifyRisk('NotifyRisk not working')
    Context = ctx;
    identify();
    loadSnippetsInner();
    createSnippetPool();
    triggerSnippet('onLoad');
}

function NotifyRisk(txt){
    console.error(txt);
    dispatchEvent(new CustomEvent('SNIPPET:risk', { detail: txt }));
    
}

function snippetVisibility(id, visible){
    if(Snippets[id]) {
        Snippets[id].visible = visible;
        return Snippets[id];
    }
}
function snippetNavVisibility(id, visible){
    if(Snippets[id]) {
        if(visible) {
            if(!Snippets[id].hasNav)
                addToNav(Snippets[id]);
            Snippets[id].hasNav = true;
        }
        else if(Snippets[id].hasNav) {
            removeFromNav(Snippets[id]);
            delete Snippets[id].hasNav;
        }
        return Snippets[id];
    }
}

function storeSnippet(el) {
    if(el.dataset.disabled)
        return;
    let id = el.id;
    if(Snippets[id])
        return Snippets[id];
    if(id === el.dataset.after)
        NotifyRisk(id +' has after ' + el.dataset.after + ' endless loop');
    var title = el.title;
    if(el.dataset.fa)
        title = `<i class="fa-solid fa-${el.dataset.fa}"></i>`;
    var data =  {
        id:id,
        title: title,
        visible: false,
        //hasNav: false,
        parentNode: el.parentNode,
        trigger: el.dataset.trigger,
        after: el.dataset.after,
        before: el.dataset.before,
        needsAuth: el.dataset.auth,
        htmlPath: 'snippets/'+id+'/index.html',
        cssPath: 'snippets/'+id+'/index.css',
        jsPath: 'snippets/'+id+'/index.js',
    }
    Snippets[id] = data;
    return data;
}

function addHtmlToSnippet(id, html){
    if(!Snippets[id])
        return;
    Snippets[id].html = html;
}
function addCssToSnippet(id, css){
    if(!Snippets[id])
        return;
    Snippets[id].css = css;
}
export function triggerSnippet(t, target){
    if(!target)
        target = 'trigger'; //basically click event
    const keys = Object.keys(Snippets);
    for(var snippetKey of keys){
        let snippet = Snippets[snippetKey];
        if(snippet[target]){
            if(isSnippetTrigger(snippet[target], t)){
                // console.log()
                getSnippet(snippet); 
            }
        }
    }
}

export function notifyAfterEvent(t, user) {
    Context.User = user;
    triggerSnippet(t, 'after');
}

export function loadSnippetsInner(){
    var s = document.querySelectorAll('[data-snippet="snippet"]');
    for(var el of s) {
        let snippet = storeSnippet(el);
        // el.remove();
        // if(snippetAuthenticated(snippet))
        //     addToNav(snippet);        
    }
}

function processNavVisibility(){
    var authenticated = Context.User ? true : false;          
    const keys = Object.keys(Snippets);
    // debugger
    for(var snippetKey of keys){
        let snippet = Snippets[snippetKey];
        if(snippet.needsAuth)
            snippetNavVisibility(snippet.id, authenticated)
        else
            snippetNavVisibility(snippet.id, true)
    }
}

function snippetAuthenticated(snippet){
    if(!snippet.needsAuth)
        return true;
    return Context.User;
}

function removeFromNav(snippet){
    var s = document.querySelector(`[data-id="${snippet.id}"]`);
    s.remove();
}

function addToNav(snippet){
    // snippet.trigger is basically click trigger
    if(snippet.trigger && snippet.trigger !== 'onLoad'){
        var navBtn = getNavButton(snippet.title);
        Context.navBar.appendChild(navBtn)
        navBtn.dataset.trigger = snippet.trigger;
        navBtn.dataset.id = snippet.id;
        navBtn.onclick = (e) => {
            var snipId = e.currentTarget.dataset.id;
            var snip = Snippets[snipId]
            // debugger
            triggerSnippet(snip.trigger);
        }            
        // snippetNavVisibility(snippet.id, true);
    }
}


export function triggerSnippets_old(t){
    var s = document.querySelectorAll('[data-snippet="snippet"]');
    for(var el of s) {
        let snippet = storeSnippet(el);
        // el.remove();
        if(el.dataset.trigger){
            if(snippet.trigger === t)
                getSnippet(el);
            else {
                var navBtn = getNavButton(el.title);
                Context.navBar.appendChild(navBtn)
                navBtn.dataset.trigger = el.dataset.trigger;
                navBtn.dataset.id = el.id;
                navBtn.onclick = (e) => {
                    var snipId = e.currentTarget.dataset.id;
                    var snip = Snippets[snipId]
                    triggerSnippet(snip.trigger);
                    //triggerSnippet()
                    // console.log('el.click', el.id, el.dataset.trigger);

                    // dispatchEvent(new CustomEvent('SNIPPET:trigger', { detail: {el: el, id: el.id, trigger: el.dataset.trigger} }));
                }
            }
        }
    }
}


export function identify(){
    var s = document.querySelectorAll('[data-snippet="snippet"]');
    for(var el of s) {
        if(el.innerHTML === '')
            el.innerHTML = el.id;
        el.classList.add('snippet-identify');
    }
}

function getNavButton(title){
    //<i class="fa-solid fa-clock-rotate-left"></i>
    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.attributes.type = 'button';
    btn.innerHTML = title;
    return btn;
    //return `<button class="btn" type="button">${title}</button>`;
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

  
function getSnippet(snippet) {
    if(Context.visibleSnippet === snippet.id)
        return;
   // el.dataset.status = 'loading';
   // el.classList.add('snippet-load');
    // el.innerHTML = 'loading ' + id;
    const nocache = '?t=' + new Date().getTime();
    const loadingTimeout = 1;
    if(snippet.html) {
        let parentEl = snippet.parentNode;
        let newEl = createElementFromHTML(snippet.html);
        parentEl.innerHTML = '';
        newEl.classList.add('fade-in');
        parentEl.appendChild(newEl);
        startSnippet(snippet.id, newEl);
        Context.visibleSnippet = snippet.id;
        snippetVisibility(snippet.id, true);
        processNavVisibility()
        return;
    }
    setTimeout(() => {
        get(snippet.htmlPath + nocache, (d) => {
            let newEl;
            if(d) {
                addHtmlToSnippet(snippet.id, d);
                let parentEl = snippet.parentNode;
                newEl = createElementFromHTML(d);
                parentEl.innerHTML = '';
                newEl.classList.add('fade-in');
                parentEl.appendChild(newEl);
                Context.visibleSnippet = snippet.id;
                snippetVisibility(snippet.id, true);
                processNavVisibility()
                // el.remove();
            }
            get(snippet.cssPath + nocache, (d2) => {
                addCssToSnippet(snippet.id, d2);
                let style = document.createElement('style');            
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(d2));
                // debugger;
                addScript(newEl, snippet.id, snippet.jsPath + nocache);                             
                // debugger
                // get(snippet.jsPath + nocache, (d) => {
                //     let snippGlobalName = snippet.id.toUpperCase();
                //     let evalstring = `window.snippPool["${snippGlobalName}"] = ${d}`;
                //     let evalstring2 = `Snippets["${snippGlobalName}"].Entry = ${d}`;
                //     eval(evalstring2);
                // })
            })
        });
    }, loadingTimeout);
}


function getSnippetByEl(el) {
    el.dataset.status = 'loading';
    el.classList.add('snippet-load');
    var id = el.id;
    var snippet = Snippets[id];
    el.innerHTML = 'loading ' + id;
    let style = document.createElement('style');

    document.head.appendChild(style);
    const nocache = '?t=' + new Date().getTime();
    const loadingTimeout = 1;
    setTimeout(() => {
        get(snippet.htmlPath + nocache, (d) => {
            addHtmlToSnippet(id, d);
            let parentEl = el.parentNode;
            let newEl = createElementFromHTML(d);
            parentEl.insertBefore(newEl, el);
            el.remove();
            get(snippet.cssPath + nocache, (d) => {
                addCssToSnippet(id, d);
                style.appendChild(document.createTextNode(d));
                addScript(el, id, snippet.jsPath + nocache);
            })
        });
    }, loadingTimeout);
}

function copyAttrs(target, source) { 
    [...source.attributes].forEach(attr => { 
        target.setAttribute(attr.nodeName, attr.nodeValue) 
    }) 
} 

function addScript(el, id, src ) {
    var s = document.createElement( 'script' );
    s.setAttribute( 'src', src );
    document.body.appendChild( s );
    
    s.onload = function() {
        let snippGlobalName = id.toUpperCase();
        //let toEval = snippGlobalName+ '.Setup()';
        let toEval = `window.snippPool["${snippGlobalName}"].Setup()`;
        if(window.snippPool[snippGlobalName] && window.snippPool[snippGlobalName].Setup) {
            eval(toEval);    
            if(el)      
                el.dataset.status = 'loaded';         
        }
        else
            console.error('snippet:', snippGlobalName, 'does not exist')
      };
  }

function startSnippet(id, el) {
    let snippGlobalName = id.toUpperCase();
    //let toEval = snippGlobalName+ '.Setup()';
    let toEval = `window.snippPool["${snippGlobalName}"].Setup()`;
    if(window.snippPool[snippGlobalName] && window.snippPool[snippGlobalName].Setup) {
        eval(toEval);          
        el.dataset.status = 'loaded';         
    }
    else
        console.error('snippet:', snippGlobalName, 'does not exist')

}
function get(url, cb) {
    fetch(url)
        .then((response) => response.text(),
        function(err) {
            console.error(`Getting ${url}`);
            // if(fallbackData) {
            //     const data = fallbackData();
            //     console.log('Using fallback data', data);
            //     return data;
            // }
            // else
            //     return {fail:true, err};
        })
        .then(function (text) {  
            if(typeof text === 'object' && text.fail){
                console.error(text.err);
                cb(text);
                return;
            }
            text = text.trim();                      
            if(text.indexOf('{') === 0 || text.indexOf('[') === 0)
                return JSON.parse(text);
            else
                return text;
            // do something with the text response 
        })
        .then((json) => {
            if(!cb) {
                console.log('no cb', cb);
            }
            else
                cb(json);
        });
}