import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "🔮 NEWS AI Core Online. Quantum media streaming layers and atmospheric tracking matrix initialized. Submit target parameters for immediate extraction.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);
  const [stashedMessage, setStashedMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Injecting custom CSS 3D keyframes directly into the document head
  useEffect(() => {
    const styleId = "news-ai-3d-effects";
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.innerText = `
        @keyframes float3D {
          0% { transform: perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateX(6deg) rotateY(-2deg) translateY(-8px); }
          100% { transform: perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 8px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.1); }
          50% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.7), inset 0 0 20px rgba(56, 189, 248, 0.3); }
          100% { box-shadow: 0 0 8px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.1); }
        }
        @keyframes slideIn3D {
          from { transform: perspective(600px) rotateX(-10deg) translateY(20px); opacity: 0; }
          to { transform: perspective(600px) rotateX(0deg) translateY(0); opacity: 1; }
        }
        @keyframes neonPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .message-bubble { animation: slideIn3D 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards; }
        .sidebar-3d-card { animation: float3D 6s ease-in-out infinite; }
        .input-glow:focus { box-shadow: 0 0 15px rgba(2, 132, 199, 0.6); border-color: #38bdf8 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Dynamically uses your deployed URL if available, otherwise falls back to local host
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || approvalPending) return;

    if (input.trim().toLowerCase() === 'exit') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: input, sender: 'user' },
        { id: Date.now() + 1, text: "🛑 Session terminated by operator. Core link closed.", sender: 'bot' }
      ]);
      setInput('');
      return;
    }

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error('Network failure');
      const data = await response.json();

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: data.response, sender: 'bot' }]);
      
      if (data.requires_approval) {
        setApprovalPending(true);
        setStashedMessage(data.original_message);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "🚨 Connection Breach: Unable to ping the agent server core.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalChoice = async (isApproved) => {
    setApprovalPending(false);
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: isApproved ? "⚡ Action Verified. Processing tool vectors..." : "❌ Target Aborted. Query deleted.", sender: 'user' }
    ]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: stashedMessage,
          confirmed_tool: isApproved
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: data.response, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Routing failure inside confirmation junction.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
      setStashedMessage('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      display: 'flex', backgroundColor: '#020617', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0, padding: 0, boxSizing: 'border-box', color: '#f8fafc', overflow: 'hidden'
    }}>
      {/* Sidebar Frame */}
      <div style={{
        width: '340px', minWidth: '340px', backgroundColor: '#0b1329', borderRight: '1px solid rgba(51, 65, 85, 0.5)',
        padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0b1329 0%, #111e3b 100%)'
      }}>
        <div className="sidebar-3d-card" style={{
          padding: '24px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(56, 189, 248, 0.2)', backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transformStyle: 'preserve-3d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 8px #38bdf8)' }}>📰</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, color: '#ffffff' }}>NEWS AI</h2>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.12em' }}>INTELLIGENCE MEDIA</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 8px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.6', fontWeight: '400' }}>
            Advanced quantum workspace managing live diagnostics, algorithmic tool call filters, and secure data tunnels.
          </p>
          <div style={{
            fontSize: '12px', color: '#64748b', padding: '10px 14px', borderRadius: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(51, 65, 85, 0.8)'
          }}>
            ⚡ Type <b style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '13px' }}>exit</b> to terminate session link.
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ animation: 'pulseGlow 4s infinite', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', backgroundColor: '#070a13', borderRadius: '12px', fontSize: '13px', color: '#cbd5e1', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <span style={{ fontSize: '16px', animation: 'neonPulse 2s infinite' }}>🌐</span> Data Pipelines Synchronized
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#070d19' }}>
        <div style={{
          padding: '22px 40px', borderBottom: '1px solid rgba(30, 41, 59, 0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(11, 19, 41, 0.8)', backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 14px #10b981', animation: 'neonPulse 1.5s infinite' }}></div>
            <span style={{ fontWeight: '600', color: '#f8fafc', fontSize: '15px' }}>AGENT MAINLINK ACTIVE</span>
          </div>
          <span style={{ fontSize: '11px', padding: '6px 14px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '20px', color: '#38bdf8', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.2)' }}>SECURE CHANNEL</span>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {messages.map((msg) => (
            <div key={msg.id} className="message-bubble" style={{
              display: 'flex', gap: '18px', maxWidth: '78%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                backgroundColor: msg.sender === 'user' ? '#0284c7' : '#111e3b',
                border: msg.sender === 'user' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.1)',
                boxShadow: msg.sender === 'user' ? '0 0 15px rgba(2, 132, 199, 0.4)' : '0 10px 20px rgba(0,0,0,0.2)'
              }}>
                {msg.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                padding: '18px 24px', borderRadius: msg.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px', 
                fontSize: '15px', lineHeight: '1.65',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(17, 30, 59, 0.6)',
                color: msg.sender === 'user' ? '#ffffff' : '#e2e8f0',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Interactive Secure Action Overlay */}
          {approvalPending && (
            <div className="message-bubble" style={{
              alignSelf: 'flex-start', marginLeft: '60px', padding: '24px',
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(249, 115, 22, 0.03) 100%)',
              border: '1px solid #ea580c', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px',
              boxShadow: '0 25px 50px -12px rgba(234, 88, 12, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', animation: 'neonPulse 1s infinite' }}>🛡️</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#f97316', letterSpacing: '0.05em' }}>RUNTIME CONFIRMATION CAPTURE</span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
                The active agent cluster is requesting direct access parameters to look up external web API networks. Confirm authorization status:
              </p>
              <div style={{ display: 'flex', gap: '14px' }}>
                <button 
                  onClick={() => handleApprovalChoice(true)}
                  style={{
                    flex: 1, padding: '12px 20px', backgroundColor: '#16a34a', color: 'white',
                    border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
                    fontWeight: '700', boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  Approve Call
                </button>
                <button 
                  onClick={() => handleApprovalChoice(false)}
                  style={{ padding: '12px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {isLoading && !approvalPending && (
            <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start', marginLeft: '60px', alignItems: 'center', color: '#94a3b8', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%', animation: 'neonPulse 1s infinite' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%', animation: 'neonPulse 1s infinite 0.2s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%', animation: 'neonPulse 1s infinite 0.4s' }}></div>
              </div>
              <span style={{ fontStyle: 'italic', color: '#38bdf8', fontWeight: '500' }}>Evaluating analytical city matrices...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Interface Processing Module */}
        <form onSubmit={handleSendMessage} style={{
          padding: '28px 40px', borderTop: '1px solid rgba(30, 41, 59, 0.7)', display: 'flex',
          gap: '18px', boxSizing: 'border-box', backgroundColor: '#0b1329'
        }}>
          <input
            type="text"
            className="input-glow"
            value={input}
            disabled={approvalPending}
            onChange={(e) => setInput(e.target.value)}
            placeholder={approvalPending ? "Awaiting hardware authorization override parameters..." : "Pass execution commands or city target variables..."}
            style={{
              flex: 1, padding: '16px 24px', backgroundColor: '#020617',
              border: '1px solid rgba(51, 65, 85, 0.6)', borderRadius: '14px', color: '#ffffff',
              outline: 'none', fontSize: '15px', boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={approvalPending}
            style={{
              backgroundColor: approvalPending ? '#334155' : '#0284c7',
              color: '#ffffff', border: 'none', padding: '0 36px', borderRadius: '14px',
              cursor: approvalPending ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px',
              boxShadow: approvalPending ? 'none' : '0 6px 20px rgba(2, 132, 199, 0.4)'
            }}
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}