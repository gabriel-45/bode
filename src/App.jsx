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
import logoImg from './assets/logo.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.nexuinsolution.com.br';
const API_KEY = import.meta.env.VITE_API_KEY || '54097daa7c0367324c0f643f74ce190f';
const INSTANCE = import.meta.env.VITE_INSTANCE || 'aipro_gabrielantoniodesouza_9_28d07d';
const STUDIO_NUMBER = '5541996440929'; // Número real do estúdio

const normalizeNumber = (num) => {
  if (!num) return '';
  const clean = num.replace(/\D/g, '');
  let final = clean.startsWith('0') ? clean.substring(1) : clean;
  // Se for um número brasileiro sem DDI (10 ou 11 dígitos), adiciona 55
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
    nome: '',
    whatsapp: '',
    ideia: '',
    tamanho: '',
    local: '',
    orcamento: '',
    qualPiercing: '',
    localPiercing: ''
  });

  const opcoesPiercing = [
    "Básicos", "Surface", "Transversal", "Mamilos", "Microdermal",
    "Alargadores (Com Pinos)", "Alargadores (No Scalp)",
    "Genitais (Feminino)", "Genitais (Masculino)"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (type) => {
    setServiceType(type);
    if (type === 'duvidas') {
      setStep(2);
    } else {
      setStep(2);
    }
  };

  const handleNextToContact = () => {
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
      setServiceType('');
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let mensagem = `*NOVA SOLICITAÇÃO - SITE*\n\n`;
    mensagem += `*Cliente:* ${formData.nome}\n`;
    mensagem += `*WhatsApp:* ${formData.whatsapp}\n\n`;
    
    if (serviceType === 'tatuagem') {
      mensagem += `*Tipo:* TATUAGEM\n`;
      mensagem += `*Ideia:* ${formData.ideia}\n`;
      mensagem += `*Tamanho:* ${formData.tamanho}\n`;
      mensagem += `*Local:* ${formData.local}\n`;
    } else if (serviceType === 'piercing') {
      mensagem += `*Tipo:* PIERCING\n`;
      mensagem += `*Categoria:* ${formData.qualPiercing}\n`;
      mensagem += `*Local:* ${formData.localPiercing}\n`;
    }

    try {
        const targetNumber = normalizeNumber(STUDIO_NUMBER);
        if (referenceImage) {
          // Enviar como Mídia (com legenda)
          const base64Image = await toBase64(referenceImage);
          await axios.post(`${API_URL}/message/sendMedia/${INSTANCE}`, {
            number: targetNumber,
            mediatype: "image",
            mimetype: referenceImage.type,
            caption: mensagem,
            media: base64Image, // Enviando com prefixo data:image/...;base64,
            fileName: referenceImage.name
          }, {
            headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' }
          });
        } else {
          // Enviar apenas Texto
          await axios.post(`${API_URL}/message/sendText/${INSTANCE}`, {
            number: targetNumber,
            text: mensagem
          }, {
            headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' }
          });
        }

      setStep(4);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      if (error.response) {
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
      }
      alert('Houve um problema ao enviar sua mensagem. Verifique a conexão do sistema.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div 
      className="min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-white/30 relative overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${bodeBg})` }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px] z-0" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Conteúdo Principal */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-20">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[420px] glass-dark rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden relative"
          >
            {/* Logo e Título INSIDE the card */}
            <div className="pt-10 pb-4 px-8 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tighter text-white/95 uppercase"
              >
                Bode <span className="text-white/40 font-light italic">Tattoo</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 mb-2 flex justify-center"
              >
                <img src={logoImg} alt="Logo" className="w-24 h-24 object-contain rounded-full border border-white/10 p-1 bg-black/20" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-white/50 text-[9px] mt-1 font-bold tracking-[0.2em] uppercase"
              >
                Atendimento Digital | Premium Experience
              </motion.p>
            </div>
            {/* Progress indicator */}
            <div className="h-1 w-full bg-white/5 flex">
              <motion.div 
                className="h-full bg-[#25D366]"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait" custom={step}>
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    custom={step}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Início</h2>
                      <p className="text-white/40 text-sm leading-relaxed">
                        Selecione como deseja transformar sua pele hoje.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'tatuagem', title: 'Tatuagem', desc: 'Design e orçamentos', icon: PenTool },
                        { id: 'piercing', title: 'Piercing', desc: 'Joias e perfurações', icon: Target },
                        { id: 'duvidas', title: 'Dúvidas', desc: 'Pós-procedimento', icon: HelpCircle },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => handleNextStep(item.id)}
                          className="w-full flex items-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group active:scale-[0.98]"
                        >
                          <div className="bg-white/10 p-3 rounded-xl text-white/70 group-hover:text-white transition-colors">
                            <item.icon size={22} strokeWidth={1.5} />
                          </div>
                          <div className="ml-4 text-left flex-1">
                            <h3 className="font-medium text-white/90 text-base">{item.title}</h3>
                            <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                          </div>
                          <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    custom={step}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <button 
                      onClick={handleBack} 
                      className="text-white/40 hover:text-white mb-6 flex items-center text-xs font-semibold tracking-wider transition-colors uppercase"
                    >
                      <ArrowLeft size={14} className="mr-2" /> Voltar
                    </button>

                    {serviceType === 'tatuagem' && (
                      <div className="space-y-5">
                        <div className="mb-6">
                          <h2 className="text-2xl font-semibold text-white tracking-tight">Solicitação de Arte</h2>
                          <p className="text-white/40 text-sm mt-1">Defina sua visão para a pele.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Sua Ideia</label>
                            <textarea 
                              required
                              name="ideia"
                              value={formData.ideia}
                              onChange={handleInputChange}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all h-28 resize-none text-sm"
                              placeholder="Descreva o que deseja tatuar..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Tamanho</label>
                              <input 
                                required
                                type="text"
                                name="tamanho"
                                value={formData.tamanho}
                                onChange={handleInputChange}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
                                placeholder="Cm aprox."
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Local</label>
                              <input 
                                required
                                type="text"
                                name="local"
                                value={formData.local}
                                onChange={handleInputChange}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
                                placeholder="Ex: Braço"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Imagem de Referência</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon size={24} className="text-white/20 mb-2" />
                                <p className="text-xs text-white/40">{referenceImage ? referenceImage.name : 'Selecionar arquivo'}</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => setReferenceImage(e.target.files[0])}
                              />
                            </label>
                          </div>
                        </div>

                        <button 
                          onClick={handleNextToContact}
                          className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] font-bold py-5 rounded-2xl mt-6 flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
                        >
                          Continuar <ArrowLeft size={18} className="ml-2 rotate-180" />
                        </button>
                      </div>
                    )}

                    {serviceType === 'piercing' && (
                      <div className="space-y-5">
                        <div className="mb-6">
                          <h2 className="text-2xl font-semibold text-white tracking-tight">Perfuração</h2>
                          <p className="text-white/40 text-sm mt-1">Selecione o procedimento.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Joia / Procedimento</label>
                            <select 
                              required
                              name="qualPiercing"
                              value={formData.qualPiercing}
                              onChange={handleInputChange}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm appearance-none"
                            >
                              <option value="" disabled className="bg-zinc-900">Selecione...</option>
                              {opcoesPiercing.map((opcao) => (
                                <option key={opcao} value={opcao} className="bg-zinc-900">{opcao}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Localização</label>
                            <input 
                              required
                              type="text"
                              name="localPiercing"
                              value={formData.localPiercing}
                              onChange={handleInputChange}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
                              placeholder="Ex: Septo, Tragus..."
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleNextToContact}
                          className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] font-bold py-5 rounded-2xl mt-6 flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
                        >
                          Continuar <ArrowLeft size={18} className="ml-2 rotate-180" />
                        </button>
                      </div>
                    )}

                    {serviceType === 'duvidas' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white tracking-tight">Cuidados</h2>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                          {[
                            { q: 'Alimentação', a: 'Evite alimentos gordurosos, carne de porco e frutos do mar por 15 dias.' },
                            { q: 'Higiene', a: 'Lave suavemente com sabonete neutro 3x ao dia.' },
                            { q: 'Exposição', a: 'Evite sol, piscina e mar durante o primeiro mês.' },
                          ].map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                              <p className="text-xs font-bold text-white/60 uppercase tracking-tighter mb-1">{item.q}</p>
                              <p className="text-sm text-white/80 leading-relaxed">{item.a}</p>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => window.open(`https://wa.me/${STUDIO_NUMBER}`, '_blank')}
                          className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold py-5 rounded-2xl border border-white/10 transition-all flex items-center justify-center active:scale-[0.98]"
                        >
                          Dúvida Específica <HelpCircle size={18} className="ml-2 opacity-60" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    custom={step}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <button 
                      onClick={handleBack} 
                      className="text-white/40 hover:text-white mb-6 flex items-center text-xs font-semibold tracking-wider transition-colors uppercase"
                    >
                      <ArrowLeft size={14} className="mr-2" /> Voltar
                    </button>

                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Contato</h2>
                      <p className="text-white/40 text-sm mt-1">Como devemos te chamar?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Nome Completo</label>
                        <input 
                          required
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
                          placeholder="Ex: Gabriel Silva"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">WhatsApp</label>
                        <input 
                          required
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
                          placeholder="Ex: 11 99999-9999"
                        />
                      </div>

                      <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] font-bold py-5 rounded-2xl mt-6 flex items-center justify-center transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
                      >
                        {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento'} 
                        {!isSubmitting && <Send size={18} className="ml-2" />}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-8 shadow-inner">
                      <CheckCircle2 className="text-white/80" size={40} strokeWidth={1} />
                    </div>
                    
                    <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Recebido.</h2>
                    <p className="text-white/40 text-sm mb-10 px-6 leading-relaxed">
                      Sua solicitação foi enviada com sucesso para nossa equipe. Irei entrar em contato em breve.
                    </p>

                    <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl flex items-start text-left max-w-[300px] mx-auto">
                      <Clock className="text-white/30 mt-0.5 shrink-0" size={18} />
                      <p className="text-[11px] text-white/30 ml-4 font-medium uppercase tracking-widest leading-relaxed">
                        Prazo médio de resposta: <span className="text-white/60">24 horas</span>
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setStep(1);
                        setFormData({
                          nome: '', whatsapp: '', ideia: '', tamanho: '', local: '', orcamento: '', qualPiercing: '', localPiercing: ''
                        });
                        setReferenceImage(null);
                      }}
                      className="mt-12 text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] py-3 px-8 rounded-full border border-white/5"
                    >
                      Reiniciar Sessão
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
