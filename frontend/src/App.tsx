import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ColorizePage } from './pages/ColorizePage';
import { AboutPage } from './pages/AboutPage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Logout } from './components/Logout';
// No need to import index.css here if imported in main.tsx

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100"> {/* Bootstrap class for full height footer */}
        <Header />
        <main className="flex-grow-1"> {/* Bootstrap class for main content to grow */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/colorize" element={<ColorizePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            {/* Optional: Add a 404 Not Found route here */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;