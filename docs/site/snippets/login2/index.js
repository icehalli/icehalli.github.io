
window.snippPool.LOGIN2 = (function () {
    let submit;    
    let password;
    let email;
    function setup(){
        //private
        submit = document.querySelector('#loginsubmit');
        password = document.querySelector('#loginpassword');
        email = document.querySelector('#loginemail');

        submit.onclick = function(){
            // {email: 'kk@kk.is', password: 'kkkkis123'}
            sendEvent('login', {email: email.value, password: password.value})
            //createUser(email.value, password.value);
            // window.addEventListener("LOGIN2:createUser", (e) => {
            //     console.log("SIGNUP:createUser", e.detail);
            // });
        }
    }

    //communication    
    function receiveEvent(evtName, data){        
        //entrypoint to closure
        //console.log(evtName, data)
    }
    function sendEvent(evtName, data){
        dispatchEvent(new CustomEvent('LOGIN2:' + evtName, { detail: data }));
        //outside listener for e.g. onElementClick
    }

    //interface
    return {
        Setup() {
            setup();
        },
        SendEvent(evt, data) {
            receiveEvent(evt, data);
        }
    }
})();
// console.log('window.LOGIN2PPPP',window.snippPool.LOGIN2)
//window.snippPool.LOGIN2 = LOGIN2;
// console.log('window.LOGIN2PPPP222',window.snippPool.LOGIN2)
addSnippetToEntry('login2', window.snippPool.LOGIN2);
// console.log('addSnippetToEntry', addSnippetToEntry)