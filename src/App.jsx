import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  PenTool, 
  Target, 
  HelpCircle, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import bodeBg from './assets/bode_fundo.png';
import logoImg from './assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.nexuinsolution.com.br';
const API_KEY = import.meta.env.VITE_API_KEY || '54097daa7c0367324c0f643f74ce190f';
const INSTANCE = import.meta.env.VITE_INSTANCE || 'aipro_gabrielantoniodesouza_9_28d07d';
const STUDIO_NUMBER = '5541996440929'; 

const normalizeNumber = (num) => {
  if (!num) return '';
  const clean = num.replace(/\D/g, '');
  let final = clean.startsWith('0') ? clean.substring(1) : clean;
  if (final.length <= 11 && !final.startsWith('55')) {
    final = '55' + final;
  }
  return final;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', whatsapp: '', ideia: '', tamanho: '', local: '', qualPiercing: '', localPiercing: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (type) => {
    setServiceType(type);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else { setStep(1); setServiceType(''); }
  };

  const resizeImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let msg = `*NOVA SOLICITAÇÃO - SITE*\n\n*Cliente:* ${formData.nome}\n*WhatsApp:* ${formData.whatsapp}\n\n`;
    if (serviceType === 'tatuagem') {
      msg += `*Tipo:* TATUAGEM\n*Ideia:* ${formData.ideia}\n*Tamanho:* ${formData.tamanho}\n*Local:* ${formData.local}\n`;
    } else {
      msg += `*Tipo:* PIERCING\n*Categoria:* ${formData.qualPiercing}\n*Local:* ${formData.localPiercing}\n`;
    }

    try {
      const targetNumber = normalizeNumber(STUDIO_NUMBER);
      if (referenceImage) {
        const optimizedMedia = await resizeImage(referenceImage);
        await axios.post(`${API_URL}/message/sendMedia/${INSTANCE}`, {
          number: targetNumber,
          mediaType: "image",
          mimetype: "image/jpeg",
          caption: msg,
          media: optimizedMedia.split('base64,')[1], // Clean base64 for API v2
          fileName: "referencia.jpg"
        }, { headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' } });
      } else {
        await axios.post(`${API_URL}/message/sendText/${INSTANCE}`, {
          number: targetNumber,
          text: msg
        }, { headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' } });
      }
      setStep(4);
    } catch (error) {
      console.error('Erro:', error);
      alert('Houve um problema ao enviar. Tente novamente ou entre em contato pelo WhatsApp direto.');
    } finally { setIsSubmitting(false); }
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d < 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans relative overflow-hidden bg-black">
      {/* Background with reduced overlay for mobile clarity */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bodeBg})` }} />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-0" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 my-6 sm:my-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] bg-black/85 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden relative"
        >
          {/* Header Section */}
          <div className="pt-12 pb-8 px-8 text-center bg-gradient-to-b from-white/[0.05] to-transparent">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center leading-none">
              <span className="text-6xl font-black tracking-tighter text-white uppercase italic">Bode</span>
              <span className="text-sm font-light tracking-[0.4em] text-white/40 uppercase mt-2">Tattoo & Piercing</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.1 }} 
              className="mt-8 flex justify-center"
            >
              <img src={logoImg} alt="Logo" className="w-44 sm:w-64 h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            </motion.div>
          </div>

          <div className="p-8 pb-10">
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 && (
                <motion.div key="s1" custom={step} variants={variants} initial="enter" animate="center" exit="exit">
                  <h2 className="text-2xl font-bold text-white mb-6">Início</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'tatuagem', title: 'Tatuagem', desc: 'Design e orçamentos', icon: PenTool },
                      { id: 'piercing', title: 'Piercing', desc: 'Joias e perfurações', icon: Target },
                      { id: 'duvidas', title: 'Dúvidas', desc: 'Para quem já tatuou', icon: HelpCircle },
                    ].map((item) => (
                      <button key={item.id} onClick={() => handleNextStep(item.id)} className="w-full flex items-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all group active:scale-[0.98]">
                        <div className="bg-white/10 p-3 rounded-xl group-hover:text-[#25D366] transition-colors"><item.icon size={22} /></div>
                        <div className="ml-4 text-left flex-1"><h3 className="font-medium text-white/90">{item.title}</h3><p className="text-xs text-white/30">{item.desc}</p></div>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-white/60" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" custom={step} variants={variants} initial="enter" animate="center" exit="exit">
                  <button onClick={handleBack} className="text-white/40 hover:text-white mb-6 flex items-center text-xs font-bold uppercase tracking-widest"><ArrowLeft size={14} className="mr-2" /> Voltar</button>
                  {serviceType === 'tatuagem' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-white mb-2">Solicitação</h2>
                      <textarea required value={formData.ideia} onChange={(e) => setFormData({...formData, ideia: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white h-28 resize-none text-sm focus:border-[#25D366]/30 transition-colors" placeholder="Descreva sua ideia..." />
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="text" value={formData.tamanho} onChange={(e) => setFormData({...formData, tamanho: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm" placeholder="Tamanho (cm)" />
                        <input required type="text" value={formData.local} onChange={(e) => setFormData({...formData, local: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm" placeholder="Local do corpo" />
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-24 bg-white/[0.02] border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all">
                        <ImageIcon size={20} className="text-white/20 mb-1" />
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{referenceImage ? referenceImage.name : 'Anexar Referência'}</p>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setReferenceImage(e.target.files[0])} />
                      </label>
                      <button onClick={() => setStep(3)} className="w-full bg-[#25D366] text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1fb355]">Continuar</button>
                    </div>
                  )}
                  {serviceType === 'piercing' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-white mb-2">Piercing</h2>
                      <select required value={formData.qualPiercing} onChange={(e) => setFormData({...formData, qualPiercing: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm appearance-none"><option value="" className="bg-zinc-900">Selecione...</option><option value="Orelha" className="bg-zinc-900">Orelha</option><option value="Nariz" className="bg-zinc-900">Nariz</option><option value="Boca" className="bg-zinc-900">Boca</option><option value="Microdermal" className="bg-zinc-900">Microdermal</option><option value="Outro" className="bg-zinc-900">Outro</option></select>
                      <input required type="text" value={formData.localPiercing} onChange={(e) => setFormData({...formData, localPiercing: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm" placeholder="Localização exata" />
                      <button onClick={() => setStep(3)} className="w-full bg-[#25D366] text-white font-bold py-5 rounded-2xl mt-4">Continuar</button>
                    </div>
                  )}
                  {serviceType === 'duvidas' && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-white mb-4">Cuidados</h2>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                        {[
                          {q: 'Sol e Mar', a: 'Evite exposição direta por pelo menos 30 dias.'},
                          {q: 'Alimentação', a: 'Evite gorduras, carne de porco e chocolate por 15 dias.'},
                          {q: 'Limpeza', a: 'Lave com sabonete neutro 3x ao dia e mantenha seco.'},
                          {q: 'Academia', a: 'Evite suor excessivo e atrito no local por uma semana.'}
                        ].map((d, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5"><p className="text-[10px] font-bold text-[#25D366] uppercase mb-1">{d.q}</p><p className="text-xs text-white/70 leading-relaxed">{d.a}</p></div>
                        ))}
                      </div>
                      <button onClick={() => window.open(`https://wa.me/${STUDIO_NUMBER}`, '_blank')} className="w-full bg-white/5 border border-white/10 text-white font-bold py-5 rounded-2xl mt-2 flex items-center justify-center hover:bg-white/10 transition-all">Dúvida Específica <Send size={16} className="ml-2" /></button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" custom={step} variants={variants} initial="enter" animate="center" exit="exit">
                  <button onClick={handleBack} className="text-white/40 hover:text-white mb-6 flex items-center text-xs font-bold uppercase tracking-widest"><ArrowLeft size={14} className="mr-2" /> Voltar</button>
                  <h2 className="text-2xl font-bold text-white mb-6">Contato</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input required type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm" placeholder="Seu Nome Completo" />
                    <input required type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-sm" placeholder="Seu WhatsApp" />
                    <button disabled={isSubmitting} type="submit" className="w-full bg-[#25D366] text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98] disabled:opacity-50">{isSubmitting ? 'Processando...' : 'Finalizar Solicitação'}</button>
                  </form>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(37,211,102,0.1)]"><CheckCircle2 className="text-[#25D366]" size={40} /></div>
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Recebido!</h2>
                  <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-[280px] mx-auto">Sua solicitação foi enviada com sucesso. Entraremos em contato em breve.</p>
                  <button onClick={() => { setStep(1); setFormData({nome:'', whatsapp:'', ideia:'', tamanho:'', local:'', qualPiercing:'', localPiercing:''}); setReferenceImage(null); }} className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-[0.3em] py-4 px-10 rounded-full border border-white/5 transition-all">Nova Solicitação</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
