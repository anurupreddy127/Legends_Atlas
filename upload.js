import { createRequire } from "module";
import admin from "firebase-admin";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");
const chapters = require("./vascoData.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadVascoStory() {
  const storyRef = db.collection("stories").doc("Vasco da Gama");

  await storyRef.set({
    title: "Vasco da Gama’s Voyage to India",
    description: "The first direct sea route from Europe to India...",
    lat: 38.7169,
    lng: -9.1399,
  });

  for (const chapter of chapters) {
    const chapterRef = storyRef.collection("chapters").doc(chapter.chapterId);
    await chapterRef.set({
      title: chapter.title,
      order: chapter.order,
      lat: chapter.lat,
      lng: chapter.lng,
    });

    for (const sub of chapter.substories) {
      await chapterRef.collection("substories").add(sub);
    }
  }

  console.log("✅ Vasco da Gama story uploaded successfully!");
}

uploadVascoStory().catch(console.error);
