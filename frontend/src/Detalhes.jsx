import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, UserCheck, Sparkles, User, IdCard, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function Detalhes() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingConvidado, setSavingConvidado] = useState(false);
  
  const [novoConvidado, setNovoConvidado] = useState({ nome: '', rg: '' });

  useEffect(() => {
    fetch(`http://localhost:8080/api/eventos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Evento não encontrado");
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleDeleteConvidado = (convidadoId) => {
    if (window.confirm("Deseja realmente remover este VIP da lista?")) {
      fetch(`http://localhost:8080/api/convidados/${convidadoId}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error("Erro na exclusão");
          setData(prev => ({
            ...prev,
            convidados: prev.convidados.filter(v => v.id !== convidadoId)
          }));
          toast.success("VIP removido da lista");
        })
        .catch(err => toast.error(err.message));
    }
  };

  const handleAddConvidado = (e) => {
    e.preventDefault();
    if (!novoConvidado.nome || !novoConvidado.rg) return;
    
    console.log("[DEBUG] Tentando enviar convidado:", novoConvidado);
    setSavingConvidado(true);
    
    fetch(`http://localhost:8080/api/eventos/${id}/convidados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoConvidado)
    })
      .then(async res => {
        if (!res.ok) {
           const errData = await res.json();
           console.error("[DEBUG-ERROR] Erro na API (status " + res.status + "):", errData);
           throw new Error(errData.error || "Erro na API.");
        }
        return res.json();
      })
      .then(convidadoCriado => {
        console.log("[DEBUG] Sucesso! Convidado retornado:", convidadoCriado);
        setData(prev => ({
          ...prev,
          convidados: [...prev.convidados, convidadoCriado]
        }));
        setNovoConvidado({ nome: '', rg: '' });
        setSavingConvidado(false);
        toast.success("VIP Adicionado com Sucesso! 💎");
      })
      .catch(err => {
        console.error("[DEBUG-CRITICAL] Falha Catastrófica ao salvar VIP:", err);
        setSavingConvidado(false);
        toast.error(err.message);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="animate-spin text-cyan-400">
          <Sparkles size={40} />
        </div>
      </div>
    );
  }

  if (!data || !data.evento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-center">
        <h2 className="text-3xl text-red-400 font-bold mb-4">Evento não localizado!</h2>
        <Link to="/" className="text-cyan-300 hover:text-cyan-100 flex items-center gap-2">
          <ArrowLeft size={20} /> Voltar para o Início
        </Link>
      </div>
    );
  }

  const { evento, convidados } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen py-10 px-4 font-sans"
    >
      <div className="w-full max-w-6xl mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors bg-white bg-opacity-5 hover:bg-opacity-10 px-4 py-2 rounded-xl backdrop-blur-md border border-white border-opacity-10">
          <ArrowLeft size={18} /> Resumo
        </Link>
      </div>

      <div className="w-full max-w-6xl backdrop-blur-xl bg-glass border border-glassBorder rounded-3xl p-8 shadow-2xl relative overflow-hidden card-refraction">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        {/* Info Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300 drop-shadow-sm mb-4">
            {evento.nome}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-200">
            <span className="flex items-center gap-2 bg-black bg-opacity-30 px-4 py-2 rounded-xl border border-white border-opacity-5">
              <MapPin className="text-cyan-400" size={18} /> {evento.local}
            </span>
            <span className="flex items-center gap-2 bg-black bg-opacity-30 px-4 py-2 rounded-xl border border-white border-opacity-5">
              <Calendar className="text-blue-400" size={18} /> {evento.data}
            </span>
            <span className="flex items-center gap-2 bg-black bg-opacity-30 px-4 py-2 rounded-xl border border-white border-opacity-5">
              <Clock className="text-indigo-400" size={18} /> {evento.horario}
            </span>
          </div>
        </div>

        {/* Grid de Formulário Novo Convidado & Tabela VIP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-white border-opacity-10 pt-8">
          
          {/* Coluna de Adição (Left / Top) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white bg-opacity-5 border border-white border-opacity-10 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-cyan-100">
                <span className="w-8 h-8 rounded-full bg-cyan-500 bg-opacity-20 flex items-center justify-center text-cyan-300 text-sm">✦</span>
                Registrar VIP
              </h2>
              
              <form onSubmit={handleAddConvidado} className="flex flex-col gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60" size={18} />
                  <input 
                    type="text" 
                    placeholder="Nome do Convidado" 
                    className="glass-input pl-10" 
                    value={novoConvidado.nome} 
                    onChange={e => setNovoConvidado({...novoConvidado, nome: e.target.value})}
                    disabled={savingConvidado}
                    required 
                  />
                </div>
                
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-60" size={18} />
                  <input 
                    type="text" 
                    placeholder="Número do RG / DOC" 
                    className="glass-input pl-10 shrink-0 font-mono text-sm" 
                    value={novoConvidado.rg} 
                    onChange={e => setNovoConvidado({...novoConvidado, rg: e.target.value})}
                    disabled={savingConvidado}
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={savingConvidado}
                  className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingConvidado ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                  {savingConvidado ? 'Salvando...' : 'Adicionar à Lista'}
                </button>
              </form>
            </div>
          </div>

          {/* Coluna da Tabela (Right / Bottom) */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
              <UserCheck className="text-green-400" size={24} />
              Lista de Convidados VIP
            </h2>

            {convidados.length === 0 ? (
              <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-10 text-center text-gray-400 flex flex-col items-center justify-center h-48">
                <p className="text-lg">A lista de convidados ainda está vazia.</p>
                <p className="text-sm mt-2 opacity-70">Cadastre os participantes usando o formulário ao lado.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white border-opacity-10 bg-black bg-opacity-20 shadow-xl backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white bg-opacity-10 text-cyan-100 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold w-12 text-center">#</th>
                        <th className="p-4 font-semibold">Nome Completo</th>
                        <th className="p-4 font-semibold">Credencial (RG)</th>
                        <th className="p-4 font-semibold w-20 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white divide-opacity-5">
                      {convidados.map((vip, i) => (
                        <tr key={vip.id || i} className="hover:bg-white hover:bg-opacity-5 transition-colors">
                          <td className="p-4 text-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mx-auto animate-pulse"></div>
                          </td>
                          <td className="p-4 font-medium text-blue-50">{vip.nome}</td>
                          <td className="p-4 font-mono text-cyan-400 text-sm tracking-wide opacity-90">{vip.rg}</td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleDeleteConvidado(vip.id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                              title="Remover VIP"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Detalhes;
