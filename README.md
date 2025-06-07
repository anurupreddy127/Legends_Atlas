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

```plaintext
src/
├── assets/            # Images and logos
├── components/        # UI Components (Map, Cards, Navbar, etc.)
├── pages/             # Page components (Home, StoryPage, NotFound)
├── styles/            # Tailwind + custom CSS
├── firebaseConfig.js  # Firebase setup
└── App.jsx            # Routing
```

## 🧪 How to Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/anurupreddy127/Legends_Atlas.git
   cd Legends_Atlas

   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Set up environment variables**
   Create a .env file in the root of the project.

   Then, add your Firebase and Google Maps API keys to the .env file:

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**

```

npm run dev

```

5. **Open in browser**
   Navigate to http://localhost:5173

## 📌 Future Enhancements

🌐 Add more stories from global mythologies

🕓 Time slider for historical events

🧭 Mini-map with progress tracking

📱 Full mobile optimization

```

```
