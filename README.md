# 🌍 Legends Atlas

**Legends Atlas** is an interactive storytelling platform that brings ancient epics like the Ramayana to life through animated, map-based visualizations powered by the **Google Maps API** and **Firebase**.

## 🚀 Features

- 🗺️ **Interactive Map-Based Stories**  
  Zoom, pan, and follow animated story paths across real-world geography.

- 📚 **Chapters and Substories**  
  Structured storytelling with rich multimedia content, organized into chapters and sub-stories.

- 🎞️ **Animated Transitions**  
  Smooth transitions between sub-stories with map animations and custom markers.

- 🎨 **Elegant UI & Glassmorphism**  
  Clean and modern UI with glassy card designs for immersive reading.

- 🔍 **Story Detail Page**  
  See an overview of the story with map preview and chapters before diving in.

- ❌ **Custom 404 Page**  
  A visually engaging error page for unmatched routes.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, AOS.js (scroll animations)
- **Backend / DB**: Firebase Firestore
- **Maps & Animation**: Google Maps Platform, `@react-google-maps/api`
- **Hosting**: Firebase Hosting (optional)

## 📁 Project Structure

src/
├── assets/ # Images and logos
├── components/ # UI Components (Map, Cards, Navbar, etc.)
├── pages/ # Page components (Home, StoryPage, NotFound)
├── styles/ # Tailwind + custom CSS
├── firebaseConfig.js # Firebase setup
└── App.jsx # Routing

## 🧪 How to Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/legends-atlas.git
   cd legends-atlas

   ```

2. **Install dependencies**

   ```npm install

   ```

3. **Add your Firebase config**
   Update firebaseConfig.js with your Firebase project credentials.

4. **Start the development server**

   ```npm run dev

   ```

5. **Open in browser**
   Navigate to http://localhost:5173

## 📌 Future Enhancements

🌐 Add more stories from global mythologies
🕓 Time slider for historical events
🧭 Mini-map with progress tracking
📱 Full mobile optimization
