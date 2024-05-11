
window.snippPool.SIGNUP2 = (function () {
    let submit;    
    let password;
    let email;
    function setup(){
        //private
        submit = document.querySelector('#submit');
        password = document.querySelector('#password');
        email = document.querySelector('#email');

        submit.onclick = function(){
            sendEvent('createUser', {email: email.value, password: password.value})
            //createUser(email.value, password.value);
            // window.addEventListener("SIGNUP2:createUser", (e) => {
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
        dispatchEvent(new CustomEvent('SIGNUP2:' + evtName, { detail: data }));
        //outside listener for e.g. onElementClick
    }

    // internal click or some internal event
    function onElementClick(e){
        var data = e.currentTarget.querySelector('span').innerHTML;
        // pushNotify(data);
        // onIdid(data); 
        //console.log('onElementClick', data);
        sendEvent('onElementClick', data);
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
// window.SIGNUP2 = SIGNUP2;