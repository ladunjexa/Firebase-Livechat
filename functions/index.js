const functions = require("firebase-functions");
var admin = require("firebase-admin");
var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.onCreate = functions.https.onCall(async (data, context) => {
  if (!context || !context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  await db.collection("posts").add({
    author: "System",
    body: `Test Cloud Message`,
    uid: "System",
    timestamp: admin.firestore.Timestamp.now(),
  });
  return { message: "Hello there" };
});

exports.onCreateAccount = functions.auth.user().onCreate(async (user) => {
  await db.collection("posts").add({
    author: "System",
    body: `${user.displayName} has joined the chat!`,
    uid: "System",
    timestamp: admin.firestore.Timestamp.now(),
  });
});
