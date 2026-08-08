import { useState, useRef, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Intentar reproducir automáticamente
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5; // Un volumen moderado
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // El navegador bloqueó el autoplay (muy común)
          setIsPlaying(false);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/Agosto.mp3" loop />
      
      <button 
        onClick={togglePlay}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 1000,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: isPlaying ? 'var(--color-primary)' : 'white',
          color: isPlaying ? 'white' : 'var(--color-text)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? <Pause size={24} /> : <Music size={24} />}
      </button>
    </>
  );
}
