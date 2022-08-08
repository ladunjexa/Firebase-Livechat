//https://speckyboy.com/chat-ui-css-javascript-code-snippets/
let firebaseUser = null;
function setupOnSnapshot() {
  var db = firebase.firestore();
  
  db.collection("posts").orderBy("timestamp").onSnapshot((querySnapshot) => {
    let innerHTML = "";
    querySnapshot.forEach((doc) => {
      const { author, timestamp, body } = doc.data();
      console.log("doc.data():" + JSON.stringify(doc.data()));
      if(!timestamp) {
        return;
      }
      const date = timestamp.toDate();
      innerHTML += `<div><font size="1">[${date.toLocaleTimeString("en-US")}]</font> <strong>${author}</strong>: ${body}</div>`;
    });
    document.getElementById("posts").innerHTML = innerHTML;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.firestore().doc('/foo/bar').get().then(() => { });
  // firebase.functions().httpsCallable('yourFunction')().then(() => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  // firebase.analytics(); // call to activate
  // firebase.analytics().logEvent('tutorial_completed');
  // firebase.performance(); // call to activate
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  document.getElementById("logout").onclick = async () => {
    await firebase.auth().signOut();
  };

  firebase.auth().onAuthStateChanged((user) => {
    firebaseUser = user;
    if (user) {
      const { email } = user;
      document.getElementById(
        "currentUser"
      ).innerText = `You are logged in as ${email}`;
    } else {
      document.getElementById(
        "currentUser"
      ).innerText = `You are not logged in`;
    }
  });

  document.getElementById("sendSystemMessage").onclick = async () => {
    firebase.functions().useFunctionsEmulator("http://localhost:5001");

    const onCreateSystemMessage = firebase.functions().httpsCallable("onCreate");
    try {
      const response = await onCreateSystemMessage({});
      console.log(`Success! ${response.data.message}`);
    } catch(e) {
      console.error(`Error in sendSystemMessage ${e}`);
    }
  };

  document.getElementById("googleLogin").onclick = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log("[console-msg] Successfully logged in");
    } catch (error) {
      console.error("[console-msg] Error logging in", error);
    }
  };
  
  document.getElementById("twitterLogin").onclick = async () => {
    try {
      const provider = new firebase.auth.TwitterAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log("[console-msg] Successfully logged in");
    } catch (error) {
      console.error("[console-msg] Error logging in", error);
    }
  };
  
  document.getElementById("facebookLogin").onclick = async () => {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log("[console-msg] Successfully logged in");
    } catch (error) {
      console.error("[console-msg] Error logging in", error);
    }
  };

  document.getElementById("appleLogin").onclick = async () => {
    try {
      const provider = new firebase.auth.AppleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log("[console-msg] Successfully logged in");
    } catch (error) {
      console.error("[console-msg] Error logging in", error);
    }
  };

  document.getElementById("microsoftLogin").onclick = async () => {
    try {
      const provider = new firebase.auth.MicrosoftAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      console.log("[console-msg] Successfully logged in");
    } catch (error) {
      console.error("[console-msg] Error logging in", error);
    }
  };

  document.getElementById("sendChatMessage").onclick = async () => {
    console.log("In sendChatMessage handler");
    var db = firebase.firestore();

    const input = document.getElementById("chatInput");
    const message = input.value || "Hello World";
    input.value = "";

    try {
      await db.collection("posts").add({
        author: firebaseUser.displayName,
        body: message,
        uid: firebaseUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Success in sendChatMessage");
    } catch (error) {
      console.error("Error in sendChatMessage", error);
    }
  };

  try {
    let app = firebase.app();
    setupOnSnapshot();
  } catch (e) {
    console.error(e);
    document.getElementById("load").innerHTML =
      "Error loading the Firebase SDK, check the console.";
  }
});
