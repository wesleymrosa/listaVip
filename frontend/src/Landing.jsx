import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Database } from 'lucide-react';

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center font-sans overflow-hidden py-10 px-4 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600 opacity-20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl backdrop-blur-2xl bg-glass border border-glassBorder rounded-3xl p-10 md:p-16 shadow-2xl relative z-10 text-center card-refraction"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto w-24 h-24 mb-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-3xl p-[2px] shadow-lg shadow-cyan-500/30"
        >
          <div className="w-full h-full bg-black bg-opacity-80 rounded-3xl flex items-center justify-center">
            <Sparkles className="text-cyan-400 w-10 h-10" />
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300 drop-shadow-sm mb-6 tracking-tight">
          Sistema ListaVip
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
          Gerenciamento inteligente de convidados com tecnologia de ponta em <br/>
          <span className="font-semibold text-cyan-200 flex items-center justify-center gap-2 mt-2">
            <Database size={20} /> Go, Gorm & React
          </span>
        </p>

        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="inline-block"
        >
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 group"
          >
            <ShieldCheck className="w-6 h-6 group-hover:text-cyan-200 transition-colors" />
            Acesse como Visitante
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Landing;
