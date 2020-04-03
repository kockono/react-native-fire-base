import firebase from 'firebase';

const conexionOnline = {
    apiKey: "AIzaSyA6t-stBQ0T4cYm35iPI_3-RbpeAFVLjuE",
    authDomain: "integradora-64ddd.firebaseapp.com",
    databaseURL: "https://integradora-64ddd.firebaseio.com",
    projectId: "integradora-64ddd",
    storageBucket: "integradora-64ddd.appspot.com",
    messagingSenderId: "966949988543",
    appId: "1:966949988543:web:70dfe4f5e9111015cb7e0a"
  };

const app = firebase.initializeApp(conexionOnline);
 const db = app.database();

 export {
   conexionOnline,
   db,

 }