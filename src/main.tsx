
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { seedFirebaseData } from './lib/firebase-seed';

// Uncomment this line to seed your Firebase database with initial data
// Only run this once, then comment it out again
// seedFirebaseData().then(() => console.log("Firebase database seeded"));

createRoot(document.getElementById("root")!).render(<App />);
