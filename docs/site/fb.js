// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { child, getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { dispSysAction, dispSysError, SysShow, GetSysEvents, System } from "./dispatcher.js";
// import { SystemLog, ErrorLog } from './log.js'

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
    const todos = ref(database, "todo")
    const mytodos = ref(database, "mytodo")
    
    //export function getTodos() {
      onValue(todos, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        const event = new CustomEvent("onTodos", { detail: {success: true, data: data} });
        dispatchEvent(event);

        // updateStarCount(postElement, data);
      });

      onValue(mytodos, (snapshot) => {
        const data = snapshot.val();
        const event2 = new CustomEvent("onMyTodos", { detail: {success: true, data: data} });
        dispatchEvent(event2);
        // console.log(data);
        const event = new CustomEvent("onTodos", { detail: {success: true, data: data} });
        dispatchEvent(event);

        // updateStarCount(postElement, data);
      });

      // get(child(database, `todo`)).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     console.log(snapshot.val());
      //   } else {
      //     console.log("No data available");
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
    //}

    ///data manip
    export function iDid(t){
      console.log('iDid', t)
      push(mytodos, t)
        .then((snap) => {
          return snap.key;
        })
        .then((key) => {
          console.log('iDid', key);
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

    async function createUser(email, password) {
      //SystemLog('backend', 'createUser', email, password)
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            const event = new CustomEvent("createUser", { detail: {success: true, user: user} });
            dispatchEvent(event);
            console.log(user);
            //return user;
            //EmUsers[user.email].SeesHeIsCreated();
          })
          .catch((error) => {            
            const event = new CustomEvent("createUser", { detail: {success: false, msg: error.message} });
            dispatchEvent(event);
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
