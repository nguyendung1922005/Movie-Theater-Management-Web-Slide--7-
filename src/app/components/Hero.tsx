import { motion } from "motion/react";
import { Play, Ticket } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-neutral-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-transparent to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1559260982-ff182e4107fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFycnklMjBuaWdodCUyMGFuaW1lJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjQ0MTE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Anime Landscape"
          className="w-full h-full object-cover object-center transform scale-105 animate-slow-zoom" 
          style={{ animation: 'zoom 20s infinite alternate' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-red-600/20 text-red-500 text-xs font-bold tracking-wider mb-4 border border-red-600/30 uppercase">
              Premiering Now
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2">
              YOUR NAME.
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-lg mb-8 leading-relaxed">
              Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-900/30 flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Get Tickets
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 group">
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              Watch Trailer
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>

      <style>{`
        @keyframes zoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
