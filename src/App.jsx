import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GoogleGenerativeAI } from '@google/generative-ai';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Chat & Telegram States
  const [chatInput, setChatInput] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: "Hello! I'm Navashen's AI buddy. I'm trained on his resume. Ask me anything!" }
  ]);
  const chatEndRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are the AI assistant for Navashen Svraaj A/L Mogan's portfolio. You answer questions about his skills and experience. Details: He is an Information Technology and digital electronics student specializing in networking systems. Currently an engineering intern in the Wide Band Gap Operation department at a semiconductor facility in Ipoh, Malaysia (internship ends May 22, 2026). He develops full-stack apps and PyTorch machine vision architectures. He speaks English, Tamil, and Bahasa Melayu. He is moving overseas for an AI Bachelor's degree on July 20, 2026. Keep answers short, professional, and friendly. If you don't know the answer, politely tell them to leave their contact info in the box below so Navashen can reach out."
  });

  useEffect(() => {
    gsap.utils.toArray('.content-section').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    const handleScroll = () => {
      if (window.scrollY > 300) setShowAIPopup(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- GEMINI CHAT FUNCTION ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Build previous chat history for context
      const formattedHistory = chatHistory.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const chatSession = model.startChat({ history: formattedHistory });
      const result = await chatSession.sendMessage(userMessage);
      
      setChatHistory(prev => [...prev, { role: 'model', text: result.response.text() }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "SYSTEM ERROR: Connection to neural net failed. Please check API keys." }]);
    }
  };

  // --- TELEGRAM TRANSMIT FUNCTION ---
  const handleContactSubmit = async () => {
    if (!contactInput.trim()) return;
    
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    const textMessage = `🚨 NEW PORTFOLIO LEAD!\nContact Info: ${contactInput}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: textMessage })
      });
      setContactInput('');
      alert("Transmission successful. Navashen has been notified.");
    } catch (error) {
      alert("Transmission failed. Please try again later.");
    }
  };

  return (
    <div className="app-container">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="top-nav">
        <div className="nav-contact">
          <a href="mailto:raajvivo03@gmail.com" className="nav-link">MSG: raajvivo03@gmail.com</a>
          <a href="https://wa.me/60175889453" target="_blank" rel="noreferrer" className="nav-link">UPLINK: WhatsApp</a>
        </div>
        <div className="nav-project">
          <a href="/project-testing" className="pulse-button">
            [ INITIALIZE LIVE SANDBOX ]
          </a>
        </div>
      </nav>

      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      <main className="scroll-container">
        
        {/* INTERACTIVE HERO SECTION */}
        <section id="hero" className="hero-split-section">
          <div className="cyber-grid"></div>

          <div className="split-layer left-layer">
            <div className="hero-text-container left-text">
              <h1>SYSTEMS</h1>
              <p>Industrial operations engineer specializing in networking systems and wide band gap manufacturing.</p>
            </div>
            <img src="/face-left.png" alt="Hardware Profile" className="face-image" />
          </div>

          <div className="split-layer right-layer">
            <div className="hero-text-container right-text">
              <h1>&lt;CODER&gt;</h1>
              <p>Full-stack developer building PyTorch machine vision architectures and interactive web applications.</p>
            </div>
            <img src="/face-right.png" alt="Software Profile" className="face-image" />
          </div>

          <div className="hero-hud">
             <a href="/resume.pdf" download className="btn-neon">
                ⬇ EXTRACT_RESUME.PDF
             </a>
          </div>

          <div className="scroll-indicator">
            <span>▼ SYSTEM SCROLL ▼</span>
          </div>
        </section>

        {/* VOLUNTEERING SECTION */}
        <section className="content-section">
          <h2>[ VOLUNTEERING ]</h2>
          <p>Highlighting community involvement, technical demonstrations for cybersecurity awareness, and initiatives supporting local technological growth.</p>
          <div className="photo-grid">
            <img src="/pic1.png" alt="Volunteering visual 1" className="photo-placeholder" />
            <img src="/pic2.png" alt="Volunteering visual 2" className="photo-placeholder" />
          </div>
          <a href="/volunteering-doc.pdf" download className="btn-neon-sm">DOWNLOAD_FILE</a>
        </section>

        {/* LEADERSHIP SECTION */}
        <section className="content-section">
          <h2>[ LEADERSHIP ]</h2>
          <p>Showcasing operational management experience, including technical presentations to department managers and coordinating engineering objectives within wide band gap semiconductor operations.</p>
          <div className="photo-grid">
            <img src="/pic3.png" alt="Leadership visual 1" className="photo-placeholder" />
            <img src="/pic4.png" alt="Leadership visual 2" className="photo-placeholder" />
          </div>
          <a href="/leadership-doc.pdf" download className="btn-neon-sm">DOWNLOAD_FILE</a>
        </section>

        {/* EDUCATION SECTION */}
        <section className="content-section">
          <h2>[ EDUCATION ]</h2>
          <p>Specializing in Information Technology, networking systems, and digital electronics, with an upcoming progression into an international Bachelor's degree program focusing on artificial intelligence.</p>
          <div className="photo-grid">
            <img src="/pic5.png" alt="Education visual 1" className="photo-placeholder" />
            <img src="/pic6.png" alt="Education visual 2" className="photo-placeholder" />
          </div>
          <a href="/education-doc.pdf" download className="btn-neon-sm">DOWNLOAD_FILE</a>
        </section>
      </main>

      {/* --- UPGRADED AI INTERFACE --- */}
      {showAIPopup && !isAIOpen && (
        <button className="ai-trigger-btn" onClick={() => setIsAIOpen(true)}>
          ✨ ACTIVATE AI ASSISTANT
        </button>
      )}

      {isAIOpen && (
        <div className="ai-chat-window">
          <div className="ai-header">
            <h4>🤖 NEURAL_NET AI</h4>
            <button className="close-btn" onClick={() => setIsAIOpen(false)}>×</button>
          </div>
          
          {/* Chat History Area */}
          <div className="ai-history">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* AI Chat Input */}
          <div className="ai-input-area">
            <input 
              type="text" 
              placeholder="Ask me a question..." 
              className="ai-input" 
              style={{ marginBottom: 0 }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
            />
            <button className="ai-submit" style={{ width: 'auto', padding: '0 15px' }} onClick={handleChatSubmit}>SEND</button>
          </div>

          {/* Telegram Contact Drop */}
          <div className="ai-contact-area">
            <p className="ai-highlight">Drop  your name and contact information (WhatsApp/Email) for direct contact:</p>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="text" 
                placeholder="Your contact info..." 
                className="ai-input" 
                style={{ marginBottom: 0 }}
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
              />
              <button className="ai-submit" style={{ width: 'auto', padding: '0 15px' }} onClick={handleContactSubmit}>
                NOTIFY
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}