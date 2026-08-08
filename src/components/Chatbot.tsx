import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '¡Hola! Soy tu asistente elotero. ¿En qué te puedo ayudar hoy?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      let botResponse = '¡Qué chido! Si tienes dudas sobre nuestros elotes, esquites o el cashback, pregúntame.';

      if (lowerInput.includes('horario') || lowerInput.includes('hora') || lowerInput.includes('abierto')) {
        botResponse = 'Abrimos todos los días de 4:00 PM a 11:00 PM. ¡Ideal para el antojo nocturno!';
      } else if (lowerInput.includes('ubicación') || lowerInput.includes('ubicacion') || lowerInput.includes('donde') || lowerInput.includes('dónde')) {
        botResponse = 'Nos encontramos en la plaza principal, frente al quiosco. ¡No tiene pierde, sigue el olor a elotito hervido!';
      } else if (lowerInput.includes('precio') || lowerInput.includes('cuesta') || lowerInput.includes('cuánto') || lowerInput.includes('cuanto')) {
        botResponse = 'Nuestros precios varían, un elote sencillo está en $25 y los preparados desde $35. ¡Checa nuestro menú en la página para ver todo!';
      } else if (lowerInput.includes('cashback') || lowerInput.includes('puntos') || lowerInput.includes('dinero')) {
        botResponse = '¡Con cada compra ganas un 10% de cashback! Lo puedes usar para pagar tus próximos elotes o esquites.';
      } else if (lowerInput.includes('hola') || lowerInput.includes('buenas')) {
        botResponse = '¡Qué onda! ¿Qué se te antoja hoy?';
      }

      setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: 'bot' }]);
    }, 600);
  };

  return (
    <>
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente virtual"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <MessageCircle size={20} />
              <span>Asistente Elotero</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input-form" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Escribe tu duda aquí..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send" disabled={!inputValue.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
