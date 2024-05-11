// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { set, child, getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { updateProfile, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { dispSysAction, dispSysError, SysShow, GetSysEvents, System } from "./dispatcher.js";
// import { SystemLog, ErrorLog } from './log.js'

if(window['mock']) {

}
else {
 // setup();
}


//function setup() {
// === SETUP ===
//export function Backend() {
    //const SysEvents = GetSysEvents();
    const firebaseConfig = {
        databaseURL: 'https://playground-9f0d6-default-rtdb.europe-west1.firebasedatabase.app/',
        apiKey: "AIzaSyDyHS1hlhqzZdMvDJkaw4_cN7tmeg1t2d8",
        authDomain: "playground-9f0d6.firebaseapp.com",
        projectId: "playground-9f0d6",
        storageBucket: "playground-9f0d6.appspot.com",
        messagingSenderId: "832646082836",
        appId: "1:832646082836:web:c3ef41218d6a1bcb16d201"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)
    const database = getDatabase(app)

    // === STORES ===
    const users = ref(database, "users")
    const todos = ref(database, "todo")
    //const mytodos = ref(database, "mytodo")
    
    //export function getTodos() {
      onValue(users, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        const event = new CustomEvent("onUsers", { detail: {success: true, data: data} });
        dispatchEvent(event);

        // updateStarCount(postElement, data);
      });
      onValue(todos, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        const event = new CustomEvent("onTodos", { detail: {success: true, data: data} });
        dispatchEvent(event);

        // updateStarCount(postElement, data);
      });

      // onValue(mytodos, (snapshot) => {
      //   const data = snapshot.val();
      //   const event2 = new CustomEvent("onMyTodos", { detail: {success: true, data: data} });
      //   dispatchEvent(event2);

      //   // updateStarCount(postElement, data);
      // });
      
            //dont know how to export this
    onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged', user) 
          const event = new CustomEvent("onAuthStateChanged", { detail: {success: true, user: user} });
          dispatchEvent(event);
          return;
      if (user) {
          const email = user.email;    
          //System.showsLoggedInView(email)
          // if(EmUsers[email]){
          //     EmUsers[email].SeesHeIsSignedIn();
          // }
      } else {
          //System.showsLoggedInFailed()
          // var key = Object.keys(EmUsers);
          // if(key.length > 0)
          //     EmUsers[key[0]].SeesHeIsSignedOut();
      }
    })

  //  }

  function refToCurrUserTodos(){
    return ref(database, "mytodo/" + getCurrentUser().uid);
  }


  export function getHistory(){
    get(refToCurrUserTodos()).then((snap) => {
      console.log('mytodos', snap.val());
      const event = new CustomEvent("getHistory", { detail: {success: true, data: snap.val()} });
      dispatchEvent(event);
    })
  }
  
  export function getFixedActions(){
    get(todos).then((snap) => {
      console.log('todos', snap.val()); 
      const event = new CustomEvent("getFixedActions", { detail: {success: true, data: snap.val()} });
      dispatchEvent(event);
    })
  }

    export function writeUserData(input) {
      const ob = input.data;
      const callBack = input.cb;
      console.log('update profile', getAuth().currentUser, ob);
      updateProfile(getAuth().currentUser, ob).then((something) => {
        console.log(something)
        //const user = userCredentials.user;
        const event = new CustomEvent(callBack.success.cb, { detail: {success: true, user: user, cb: callBack} });
        dispatchEvent(event);
        // dispatchEvent(new CustomEvent('FB:GLOBAL', { detail: {success: true, user: user, cb: callBack}}));
        //console.log(user);
        //return user;
        //EmUsers[user.email].SeesHeIsCreated();
      })
      .catch((error) => {
        dispatchEvent(new CustomEvent(callBack.fail.cb, { detail: {success: false, user: null, msg: error.message, cb: callBack} }));
        // dispatchEvent(new CustomEvent('FB:GLOBAL', { detail: {success: false, user: null, msg: error.message, cb: callBack}}));
        // const event = new CustomEvent("setUser", { detail: {success: false, msg: error.message} });
        // dispatchEvent(event);
      });
    }

    ///data manip
    export function iDid(input) {
      const ob = input.data;
      const callBack = input.cb;
      console.log('iDid', ob)
      // const ob = {}
      // ob[t.uid] = t;
      push(refToCurrUserTodos(), ob)
        .then((snap) => {
          const event = new CustomEvent(callBack.success.cb, { detail: {success: true, snap: snap, cb: callBack} });
          dispatchEvent(event);
        })
        .catch((error) => {   
          console.log('iDid', key);     
          const event2 = new CustomEvent(callBack.fail.cb, { detail: {success: false, msg: error.message, cb: callBack} });
          dispatchEvent(event2);
          //removeItem(key);
          //getItem(key);
        });
    }
    export function addItem(t){
      console.log('addItem', t)
      push(todos, t)
        .then((snap) => {
          return snap.key;
        })
        .then((key) => {
          console.log('added', key);
          //removeItem(key);
          //getItem(key);
        });
    }

    ///Auth
    //
    export function getCurrentUser(){
      return getAuth().currentUser;
    }
    
    async function createUser(input) {
      const ob = input.data;
      const callBack = input.cb;
      //SystemLog('backend', 'createUser', email, password)
        createUserWithEmailAndPassword(auth, ob.email, ob.password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            dispatchEvent(new CustomEvent(callBack.success.cb, { detail: {success: true, user: user, cb: callBack} }));
            //return user;
            //EmUsers[user.email].SeesHeIsCreated();
          })
          .catch((error) => {      
            dispatchEvent(new CustomEvent(callBack.fail.cb, { detail: {success: false, user: null, msg: error.message, cb: callBack} }));
          })
        }

    function ErrorLog(msg){
      console.log('msg', msg);
    }
        
    async function signInUser(email, password) {
        //SystemLog('backend', 'signInUser', email, password)
        //return await signInWithEmailAndPassword(auth, email, password);
        let em = 'error'
        //console.log('signInUser', email, password)
        await signInWithEmailAndPassword(auth, email, password)
           .then((userCredentials) => {            
            const event = new CustomEvent("signInUser", { detail: {success: true, user: userCredentials.user} });
            dispatchEvent(event);
        //     const user = userCredentials.user;
        //     //onAuthStateChanged above handles this
        //     //dispSysAction(user);
        //     //em = user.email
           })
          .catch((error) => {            
            const event = new CustomEvent("signInUser", { detail: {success: false, msg: error.message} });
            dispatchEvent(event);
          })
          return em
        }    
    function signOutUser() {
      //SystemLog('backend', 'signOutUser')
        signOut(auth)
          //.then(() => SysEvents.logoutSuccess())
          .catch((error) => {            
            const event = new CustomEvent("signOutUser", { detail: {success: false, msg: error.message} });
            dispatchEvent(event);
          })
      }
      export {
        signInUser,
        signOutUser,
        createUser
      };
