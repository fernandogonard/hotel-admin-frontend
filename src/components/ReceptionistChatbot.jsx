import React, { useState } from 'react';
import axios from 'axios';

// ⚠️ IMPORTANTE: Usa una variable de entorno o backend proxy para la API key en producción
const OPENAI_API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza por tu API key o usa variable de entorno

export default function ReceptionistChatbot() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Eres un asistente para recepcionistas de hotel. Responde de forma clara y profesional.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
          max_tokens: 256,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const reply = res.data.choices[0].message.content;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error al conectar con el asistente.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, maxWidth: 400, background: '#fff' }}>
      <h3>Chatbot Recepción</h3>
      <div style={{ minHeight: 120, maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '4px 0' }}>
            <span style={{ background: msg.role === 'user' ? '#e63946' : '#f1f1f1', color: msg.role === 'user' ? '#fff' : '#333', borderRadius: 12, padding: '6px 12px', display: 'inline-block' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu consulta..."
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ borderRadius: 8, background: '#e63946', color: '#fff', border: 'none', padding: '8px 16px' }}>
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
