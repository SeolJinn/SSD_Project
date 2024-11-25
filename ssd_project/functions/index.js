const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Cloud function to handle unfriending
exports.unfriendUser = onCall(async (data, context) => {
  const { currentUserId, friendId } = data;

  // Ensure the user is authenticated
  if (!context.auth) {
    throw new admin.functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to unfriend someone."
    );
  }

  try {
    // References to both users' documents
    const currentUserRef = db.collection("users").doc(currentUserId);
    const friendRef = db.collection("users").doc(friendId);

    // Remove friend from current user's friends array
    await currentUserRef.update({
      friends: admin.firestore.FieldValue.arrayRemove(friendId),
    });

    // Remove current user from friend's friends array
    await friendRef.update({
      friends: admin.firestore.FieldValue.arrayRemove(currentUserId),
    });

    return { message: "Friend removed successfully." };
  } catch (error) {
    console.error("Error unfriending:", error);
    throw new admin.functions.https.HttpsError(
      "internal",
      "Failed to remove friend."
    );
  }
});
