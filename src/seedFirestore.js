import { db } from "./firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

const storyId = "ramayana"; // story document ID

const chapters = [
  {
    id: "chapter1",
    title: "Ayodhya – The Beginning",
    description:
      "Birthplace of Lord Rama and the starting point of his journey.",
    lat: 26.7996,
    lng: 82.2041,
    order: 1,
  },
  {
    id: "chapter2",
    title: "Kishkindha – Alliance with Hanuman",
    description:
      "Where Rama meets Hanuman and forms an alliance with the monkey army.",
    lat: 15.335,
    lng: 76.46,
    order: 2,
  },
  {
    id: "chapter3",
    title: "Rameswaram – The Bridge to Lanka",
    description: "The site where the Rama Setu bridge to Lanka was built.",
    lat: 9.2876,
    lng: 79.3129,
    order: 3,
  },
  {
    id: "chapter4",
    title: "Lanka – The Final Battle",
    description: "The kingdom of Ravana, where the final battle took place.",
    lat: 6.9497,
    lng: 80.7891,
    order: 4,
  },
];

export async function seedFirestore() {
  try {
    const storyRef = doc(db, "stories", storyId);
    await setDoc(storyRef, {
      title: "The Journey of Rama",
      description: "Key locations from the epic Ramayana",
    });

    const chaptersRef = collection(storyRef, "chapters");

    for (const chapter of chapters) {
      const chapterRef = doc(chaptersRef, chapter.id);
      await setDoc(chapterRef, chapter);
    }

    console.log("✅ Firestore seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  }
}
