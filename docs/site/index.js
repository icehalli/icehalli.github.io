
import { getFixedActions, getHistory, writeUserData, iDid, addItem, signOutUser, createUser, signInUser, getCurrentUser } from "./fb.js"
//import { writeUserData, iDid, addItem, signOutUser, createUser, signInUser, getCurrentUser } from "./fbmock.js"
import { notifyAfterEvent, addSnippetToEntry, logSnippets, loadSnippets, triggerSnippet } from "./snippets.js"
window.snippPool = new Object();
window.addSnippetToEntry = addSnippetToEntry;
loadSnippets({
    navBar:document.getElementById('top')
});

let loginOnload = false;

    window.addEventListener("onAuthStateChanged", (e) => {
        if(e.detail.user){
            //pushNotify('logged in');
            notifyAfterEvent('login', getCurrentUser());
            loginOnload = true;
        }
        else{
            //pushNotify('not logged in');
            notifyAfterEvent('signout');
        }
    });

    window.addEventListener("SELECTOR:onElementClick", (e) => {
        console.log("SELECTOR:onElementClick", e.detail);        
        if(e.detail.msg)            
            pushNotify(e.detail.msg);
        //onIdid(e.detail);
        iDid(e.detail);
    });
    
    window.addEventListener("SIGNUP2:createUser", (e) => {
        console.log("SIGNUP2:createUser", e.detail);
    });
    window.addEventListener("USER:saveUser", (e) => {
        console.log("USER:saveUser", e.detail);
        if(e.detail.msg)            
            pushNotify(e.detail.msg);
        writeUserData(e.detail)
    });
    window.addEventListener("LOAD:dataRequest", (e) => {
        if(loginOnload)
            notifyAfterEvent('login', getCurrentUser());
        // if(isAuthenticated()){
        //     pushNotify('logged in');
        //     notifyAfterEvent('login');
        // }
        // else{
        //     pushNotify('not logged in');
        //     notifyAfterEvent('signout');
        // }
    });
    window.addEventListener("setUser", (e) => {
        console.log("setUser", e.detail);
        // window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
    });
    
    window.addEventListener("FB:GLOBAL", (e) => {
        console.log("FB:GLOBAL", e.detail);
        // window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
    });



    window.addEventListener("NOTIFY:notify", (e) => {
        console.log("setUser", e.detail);
        pushNotify(e.detail.data);
    });

    
    function pushNotify(data, title = "🔥 Vel gert", status = null) {//'error', 'warning', 'success', 'info'
        if(status === 'error')
            data = data.replace('Firebase: ', '');
            let f = {};
            if(status === 'error')
                f.status = status;
            f.title = title;
            f.text = data;
            f.autotimeout = status === 'error' ? 5000 : 500;
            
            new Notify(f);
    }


    
    
    window.addEventListener("LOGIN2:login", (e) => {
        console.log("LOGIN2:login", e.detail);
        signInUser(e.detail.email, e.detail.password);
    });
    window.addEventListener("signInUser", (e) => {
        //onSignin(e.detail);
        isAuthenticated();
        //triggerSnippet('afterLogin');
        notifyAfterEvent('login', getCurrentUser())
        console.log('getting hist')
        //getHistory();
    });

    
    window.addEventListener("getHistory", (e) => {
        console.log("getHistory", e.detail);
        window.snippPool['OVERVIEW'].SendEvent('history', e.detail.data)
    });
    
    window.addEventListener("SIGNOUT:dataRequest", (e) => {
        console.log("USER:dataRequest", e.detail);
        signOutUser();
        notifyAfterEvent('signout');
    });
    window.addEventListener("USER:dataRequest", (e) => {
        console.log("USER:dataRequest", e.detail);
        let user = isAuthenticated();
        if(user) {
            window.snippPool['USER'].SendEvent('user', user)
        }
    });
    window.addEventListener('SNIPPET:risk', (e) => {
        //not working does not get events from snippets.js (cause its a module ?)
        console.log('WTF');
        throw new Error(e.detail);
    });
    window.addEventListener("OVERVIEW:dataRequest", (e) => {
        console.log("OVERVIEW:dataRequest", e.detail);
        if(isAuthenticated()) {
            console.log('getting hist')
            getHistory();
        }
    });
    window.addEventListener("getFixedActions", (e) => {
        console.log("getFixedActions", e.detail);
        window.snippPool['SELECTOR'].SendEvent('todos', e.detail.data)
    });
    window.addEventListener("SELECTOR:dataRequest", (e) => {
        console.log("SELECTOR:dataRequest", e.detail);
        if(isAuthenticated()) {
            console.log('getting hist')
            getFixedActions();
        }
    });
    

    window.addEventListener('SNIPPET:trigger', (e) => {
        var id = e.detail.id.toUpperCase();
        console.log(e.detail.el.dataset.trigger)
        console.log('SNIPPET:trigger', id, e.detail);
        //window[id].SendEvent(e.detail);
    });

    

    function isAuthenticated(){
        const user = getCurrentUser();
        console.log('usER',user)
        if(user)
            console.log(user.email)
        else
            notifyAfterEvent('signout')
        return user;
    }
window.logSnippets = logSnippets;