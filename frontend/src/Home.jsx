import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, PlusCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function Home() {
  const [eventos, setEventos] = useState([]);
  const [novoEvento, setNovoEvento] = useState({ nome: '', local: '', data: '', horario: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEventos(data);
      })
      .catch(err => console.error("Erro ao buscar eventos", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoEvento)
    })
      .then(async res => {
         if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || "Erro ao tentar salvar o evento");
         }
         return res.json();
      })
      .then(data => {
        setEventos([...eventos, data]);
        setNovoEvento({ nome: '', local: '', data: '', horario: '' });
        toast.success("Evento Agendado com Sucesso! 🚀");
      })
      .catch(err => {
        toast.error(err.message);
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen pt-10 font-sans"
    >
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-100 drop-shadow-sm flex items-center justify-center gap-3">
          <Sparkles className="text-cyan-300" size={36} />
          ListaVip
        </h1>
        <p className="mt-2 text-cyan-100 opacity-80 text-lg">Eventos Vanguarda</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Formulário (4 colunas) */}
        <div className="lg:col-span-4 backdrop-blur-xl bg-glass border border-glassBorder rounded-3xl p-8 shadow-2xl card-refraction group">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-cyan-400 bg-opacity-20 flex items-center justify-center text-cyan-300 text-sm">✦</span>
            Novo Evento
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60" size={18} />
              <input 
                type="text" 
                placeholder="Nome do Evento" 
                className="glass-input pl-10" 
                value={novoEvento.nome} 
                onChange={e => setNovoEvento({...novoEvento, nome: e.target.value})}
                required 
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60" size={18} />
              <input 
                type="text" 
                placeholder="Local" 
                className="glass-input pl-10"
                value={novoEvento.local} 
                onChange={e => setNovoEvento({...novoEvento, local: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 pointer-events-none" size={18} />
                <input 
                  type="date" 
                  className="glass-input pl-10 text-gray-200"
                  value={novoEvento.data} 
                  onChange={e => setNovoEvento({...novoEvento, data: e.target.value})}
                  required 
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60 pointer-events-none" size={18} />
                <input 
                  type="time" 
                  className="glass-input pl-10 text-gray-200"
                  value={novoEvento.horario} 
                  onChange={e => setNovoEvento({...novoEvento, horario: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle size={20} />
              Criar Evento
            </button>
          </form>
        </div>

        {/* Lista (8 colunas) */}
        <div className="lg:col-span-8 backdrop-blur-xl bg-glass border border-glassBorder rounded-3xl p-8 shadow-2xl min-h-[400px] card-refraction group">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-blue-300 text-sm">❖</span>
            Eventos Agendados
          </h2>
          {eventos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70 mt-10">
              <p>Nenhum evento registrado ainda.</p>
              <p className="text-sm mt-2">Comece adicionando um novo ao lado!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventos.map((ev, index) => (
                <Link to={`/eventos/${ev.id}`} key={index}>
                  <div className="group/card p-5 rounded-2xl bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    
                    <h3 className="text-xl font-bold text-blue-100 mb-2 truncate" title={ev.nome}>
                      {ev.nome}
                    </h3>
                    
                    <div className="space-y-2 mt-2">
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        <MapPin size={14} className="text-cyan-400" />
                        {ev.local}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-mono bg-black bg-opacity-30 py-2 px-3 rounded-lg text-cyan-200">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {ev.data}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {ev.horario}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
