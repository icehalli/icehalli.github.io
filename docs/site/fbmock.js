    export function writeUserData(ob) {
        // const event = new CustomEvent("setUser", { detail: {success: true, user: something} });
        // dispatchEvent(event);
        // const event = new CustomEvent("setUser", { detail: {success: false, msg: error.message} });
        // dispatchEvent(event);
        console.log('not implemented');
    }

    ///data manip
    export function iDid(t){
      console.log('iDid', t);
    }
    export function addItem(t){
      console.log('addItem', t)
    }

    ///Auth
    //
    let getAuthcurrentUser = null;
    window.addEventListener("onAuthStateChanged", (e) => {
      console.log('mock:onAuthStateChanged')
      getAuthcurrentUser = e.detail.user;
    });
    export function getCurrentUser(){
      return getAuthcurrentUser;
    }
    
    async function createUser(email, password) {
        console.log('mock:createUser')
            // const event = new CustomEvent("createUser", { detail: {success: true, user: user} });
            // dispatchEvent(event);  
            // const event = new CustomEvent("createUser", { detail: {success: false, msg: error.message} });
            // dispatchEvent(event);
        }

    function ErrorLog(msg){
      console.log('msg', msg);
    }
        
    async function signInUser(email, password) {   
      console.log('mock:signInUser');
      // let em = 'error'
      //       const event = new CustomEvent("signInUser", { detail: {success: true, user: userCredentials.user} });
      //       dispatchEvent(event);
      //       const event = new CustomEvent("signInUser", { detail: {success: false, msg: error.message} });
      //       dispatchEvent(event);
      //     return em
        }    
    function signOutUser() {
      console.log('mock:signOutUser');        
            // const event = new CustomEvent("signOutUser", { detail: {success: false, msg: error.message} });
            // dispatchEvent(event);
      }
      export {
        signInUser,
        signOutUser,
        createUser
      };
