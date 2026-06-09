import React, { useState, useEffect, useRef, useMemo } from "react";

// Hook para detectar cuando un elemento entra en viewport
function useInView(ref, threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "50px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isInView;
}

// ------- SVG ornaments inline -------
const BotanicalTop = ({ className = "" }) => (
  // delicate hand-drawn botanical sprig — two stems with leaves and tiny berries
  <svg viewBox="0 0 240 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#c79c4a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* center stem going down */}
      <path d="M120 6 L120 74" opacity="0.0"/>
      {/* left curving stem */}
      <path d="M120 14 C 105 22, 80 30, 58 38 C 44 44, 30 48, 18 52"/>
      <path d="M120 22 C 102 32, 78 40, 56 48 C 42 54, 28 58, 14 62"/>
      {/* right curving stem */}
      <path d="M120 14 C 135 22, 160 30, 182 38 C 196 44, 210 48, 222 52"/>
      <path d="M120 22 C 138 32, 162 40, 184 48 C 198 54, 212 58, 226 62"/>
      {/* leaves left */}
      <path d="M62 36 q -6 -8 -16 -6 q 6 10 16 6 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M85 30 q -5 -7 -14 -5 q 5 8 14 5 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M40 50 q -7 -7 -16 -3 q 6 9 16 3 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M100 26 q -4 -6 -12 -4 q 4 7 12 4 z" fill="#e7c585" fillOpacity="0.55"/>
      {/* leaves right */}
      <path d="M178 36 q 6 -8 16 -6 q -6 10 -16 6 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M155 30 q 5 -7 14 -5 q -5 8 -14 5 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M200 50 q 7 -7 16 -3 q -6 9 -16 3 z" fill="#e7c585" fillOpacity="0.55"/>
      <path d="M140 26 q 4 -6 12 -4 q -4 7 -12 4 z" fill="#e7c585" fillOpacity="0.55"/>
      {/* tiny berries */}
      <circle cx="50" cy="44" r="1.6" fill="#c79c4a"/>
      <circle cx="72" cy="38" r="1.4" fill="#c79c4a"/>
      <circle cx="92" cy="32" r="1.4" fill="#c79c4a"/>
      <circle cx="190" cy="44" r="1.6" fill="#c79c4a"/>
      <circle cx="168" cy="38" r="1.4" fill="#c79c4a"/>
      <circle cx="148" cy="32" r="1.4" fill="#c79c4a"/>
      {/* center top crown */}
      <path d="M115 16 C 117 10, 123 10, 125 16" />
      <circle cx="120" cy="10" r="1.5" fill="#c79c4a"/>
    </g>
  </svg>
);

// small adorno (single sprig used on cards and dividers between elements)
const AdornoSmall = ({ className = "", color = "#c79c4a" }) => (
  <svg viewBox="0 0 80 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke={color} strokeWidth="1" strokeLinecap="round" fill="none">
      <path d="M40 12 L8 12" />
      <path d="M40 12 L72 12" />
      <path d="M18 12 q -4 -4 -8 -2" />
      <path d="M28 12 q -3 -4 -8 -3" opacity="0.7" />
      <path d="M62 12 q 4 -4 8 -2" />
      <path d="M52 12 q 3 -4 8 -3" opacity="0.7" />
      <path d="M36 12 q 2 -3 4 -3 q 2 0 4 3" />
      <circle cx="40" cy="9" r="1.4" fill={color}/>
    </g>
  </svg>
);

// the date flourish (small leafy bracket on each side of date)
const DateFlourish = ({ flip = false }) => (
  <svg viewBox="0 0 40 14" fill="none" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
    <g stroke="#c79c4a" strokeWidth="0.9" strokeLinecap="round" fill="none">
      <path d="M2 7 L34 7" />
      <path d="M28 7 q 3 -3 8 -2" />
      <path d="M22 7 q 2 -3 6 -2" opacity="0.7" />
      <circle cx="36" cy="5" r="1" fill="#c79c4a"/>
    </g>
  </svg>
);

// Scalloped torn-paper wave divider (top / bottom orientations)
const Wave = ({ flip = false, color = "#ffffff", bg = "transparent" }) => (
  <svg viewBox="0 0 440 14" preserveAspectRatio="none" style={{ background: bg, transform: flip ? "scaleY(-1)" : "none" }}>
    <path
      d="M0 14 Q 10 4, 22 8 T 44 8 T 66 8 T 88 8 T 110 8 T 132 8 T 154 8 T 176 8 T 198 8 T 220 8 T 242 8 T 264 8 T 286 8 T 308 8 T 330 8 T 352 8 T 374 8 T 396 8 T 418 8 T 440 8 L 440 14 Z"
      fill={color}
    />
  </svg>
);

// Section divider between blocks: cream-to-white scalloped wave with botanical overlay
const SectionDivider = ({ from = "#ffffff", to = "#ffffff", ornament = true }) => (
  <div style={{ position: "relative", background: from }}>
    <svg viewBox="0 0 440 18" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 18 }}>
      <path
        d="M0 0 Q 14 18, 28 6 T 56 6 T 84 6 T 112 6 T 140 6 T 168 6 T 196 6 T 224 6 T 252 6 T 280 6 T 308 6 T 336 6 T 364 6 T 392 6 T 420 6 T 440 6 L 440 18 L 0 18 Z"
        fill={to}
      />
    </svg>
    {ornament && (
      <BotanicalTop
        style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: -6, width: 160, height: 60, pointerEvents: "none" }}
      />
    )}
  </div>
);

// ------- Icons -------
const HeartIcon = ({ className = "", filled = true }) => (
  <svg viewBox="0 0 32 32" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
    <path d="M16 27 C 6 19, 3 13, 6 9 C 9 5, 14 6, 16 10 C 18 6, 23 5, 26 9 C 29 13, 26 19, 16 27 Z" />
  </svg>
);
const RingsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="24" cy="36" r="14" />
    <circle cx="40" cy="36" r="14" />
    <path d="M19 18 L24 24 L29 18" />
    <path d="M22 22 L26 22" opacity="0.5" />
  </svg>
);
const PartyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 52 L26 18 L46 38 Z" />
    <path d="M14 46 L22 50" />
    <path d="M18 38 L26 42" />
    <path d="M48 14 L52 10" />
    <path d="M52 18 L56 18" />
    <path d="M44 8 L44 4" />
    <circle cx="50" cy="24" r="1.2" fill="currentColor" />
    <circle cx="56" cy="14" r="1.2" fill="currentColor" />
    <circle cx="40" cy="10" r="1.2" fill="currentColor" />
  </svg>
);
const CameraIcon = () => (
  <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="10" width="30" height="20" rx="2" />
    <circle cx="18" cy="20" r="6" />
    <circle cx="18" cy="20" r="2.5" />
    <path d="M11 10 L13 6 L23 6 L25 10" />
    <circle cx="28" cy="14" r="0.8" fill="currentColor" />
  </svg>
);
const MusicNote = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 34 V 12 L 36 8 V 28" />
    <ellipse cx="16" cy="34" rx="5" ry="4" />
    <ellipse cx="32" cy="28" rx="5" ry="4" />
  </svg>
);
const BowTie = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M8 18 L22 24 L8 30 Z" />
    <path d="M40 18 L26 24 L40 30 Z" />
    <rect x="22" y="22" width="4" height="4" rx="0.5" />
  </svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="12" y="10" width="24" height="32" rx="2" />
    <rect x="18" y="6" width="12" height="6" rx="1.2" />
    <path d="M18 22 L30 22" />
    <path d="M18 28 L30 28" />
    <path d="M18 34 L26 34" />
  </svg>
);
const BusIcon = () => (
  <svg viewBox="0 0 60 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="12" width="44" height="22" rx="3" />
    <path d="M8 24 L52 24" />
    <rect x="12" y="16" width="10" height="6" />
    <rect x="26" y="16" width="10" height="6" />
    <rect x="40" y="16" width="8" height="6" />
    <circle cx="18" cy="38" r="3" />
    <circle cx="42" cy="38" r="3" />
  </svg>
);
const HotelIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M8 42 L8 14 L24 6 L40 14 L40 42 Z" />
    <rect x="20" y="28" width="8" height="14" />
    <rect x="14" y="20" width="5" height="5" />
    <rect x="29" y="20" width="5" height="5" />
    <path d="M22 16 L26 14 L24 12 Z" fill="currentColor" />
  </svg>
);
const GiftIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <rect x="8" y="20" width="32" height="22" rx="1.5" />
    <path d="M6 14 L42 14 L42 22 L6 22 Z" />
    <path d="M24 14 L24 42" />
    <path d="M24 14 C 18 4, 12 8, 16 14 Z" />
    <path d="M24 14 C 30 4, 36 8, 32 14 Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="24" height="24" rx="6" />
    <circle cx="16" cy="16" r="6" />
    <circle cx="23" cy="9" r="1.2" fill="currentColor" />
  </svg>
);
const MusicCircle = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M14 4 L14 12.2 A 3 3 0 1 1 12 9.2 V 7 L 8 8 V 14.2 A 3 3 0 1 1 6 11.2 V 5 Z" />
  </svg>
);

// ------- Hooks -------
function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours   = Math.floor(diff / 3600000) % 24;
  const days    = Math.floor(diff / 86400000);
  return { days, hours, minutes, seconds };
}

// ------- The page -------
function Invitation() {
  // Set the date a couple months out for a live countdown
  const targetDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(2027);
    d.setMonth(7);
    d.setDate(3);
    d.setHours(19);
    d.setMinutes(0);
    return d.getTime();
  }, []);
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const [musicOn, setMusicOn] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [lightbox, setLightbox] = useState(null);
  
  // Referencia para el audio
  const audioRef = useRef(null);

  // Refs para las secciones que se animarán
  const countdownRef = useRef(null);
  const eventCardRef = useRef(null);
  const galleryRef = useRef(null);
  const fiestaRef = useRef(null);
  const giftsRef = useRef(null);
  const igRef = useRef(null);

  // Detectar cuando cada sección entra en viewport
  const countdownInView = useInView(countdownRef);
  const eventInView = useInView(eventCardRef);
  const galleryInView = useInView(galleryRef);
  const fiestaInView = useInView(fiestaRef);
  const giftsInView = useInView(giftsRef);
  const igInView = useInView(igRef);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  useEffect(() => {
    const bg = document.querySelector(".hero-bg");
    if (!bg) return;

    let targetY = 0;
    let currentY = 0;

    const onScroll = () => {
      targetY = window.scrollY;
    };

    const animate = () => {
      // suavizado tipo “cámara pesada”
      currentY += (targetY - currentY) * 0.06;

      // LIMITAMOS efecto SOLO al inicio (clave para el “wow”)
      const limit = 500;
      const progress = Math.min(currentY / limit, 1);

      // easing cinematográfico (lento al principio)
      const ease = 1 - Math.pow(1 - progress, 3);

      // PARALLAX más suave cuanto más scroll
      const factor = 0.15 + (0.2 * (1 - ease));

      const y = currentY * factor;

      bg.style.transform = `translate3d(0, ${y}px, 0)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    animate();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reproducir/pausar música
  useEffect(() => {

    if (!audioRef.current) return;
    
    if (musicOn) {
      audioRef.current.play().catch(err => {
        console.log("Error reproduciendo:", err);
        showToast("No se pudo reproducir la música");
        setMusicOn(false);
      });
      showToast("🎵 Música activada");
    } else {
      audioRef.current.pause();
      showToast("⏸️ Música pausada");
    }
  }, [musicOn]);

  // Intento de autoplay la primera vez que visita la web
  useEffect(() => {
    try {
      // Esperamos un poco a que el audio esté montado
        setTimeout(() => {
          if (!audioRef.current) return;
          audioRef.current.play().then(() => {
            setMusicOn(true);
            showToast('🎵 Música activada automáticamente');
          }).catch(() => {
            // Si el navegador bloquea autoplay, mostramos pista
            showToast('Pulsa el botón para reproducir la música');
          });
        }, 300);
    } catch (e) {
      // fallar silenciosamente
    }
  }, []);

  const toggleMusic = () => {
    setMusicOn(!musicOn);
  };

  const photos = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&auto=format&fit=crop",
  ];
 
  return (
    <div className="invite">
      {/* ======= HERO ======= */}
      <section className="hero">

        <div
            className="hero-bg"
          />

        <audio 
          ref={audioRef}
          src="/musica/dtmf.mp3"
          loop
          style={{ display: 'none' }}
        />
        
        <button className={`music-toggle ${musicOn ? "playing" : ""}`} onClick={toggleMusic} aria-label="Música">
          <MusicCircle />
        </button>

        <BotanicalTop className="hero-top-ornament" />

        <div className="hero-date">
          <DateFlourish flip />
          <span>03.07.2027</span>
          <DateFlourish />
        </div>

        <h1 className="hero-names">
          Eugenio<span className="amp">&amp;</span>Esther
        </h1>
        <div className="hero-rule"></div>
        <p className="hero-sub">Nuestra invitación a la Boda</p>

        <div className="quote">
          <span className="quote-mark top">&ldquo;</span>
          Todos somos mortales,<br />
          hasta el primer beso<br />
          y la segunda copa de vino
          <span className="quote-mark bottom">&rdquo;</span>
        </div>

      <div ref={countdownRef} className={`block ${countdownInView ? 'animate-in' : ''}`} style={{ marginTop: 10, paddingTop: 0, paddingBottom: 0 }}>
        <h2 className="countdown-title">Faltan...</h2>
        <div className="counters">
          {[
            { n: days, l: "días" },
            { n: hours, l: "hs" },
            { n: minutes, l: "min" },
            { n: seconds, l: "seg" },
          ].map((c, i) => (
            <div className="counter" key={i}>
              <div className="counter-num">{String(c.n).padStart(c.l === "días" ? 1 : 2, "0")}</div>
              <div className="counter-label">{c.l}</div>
            </div>
          ))}
        </div>
        <HeartIcon className="heart-pulse" />
      </div>

      </section>

      {/* <SectionDivider from="#faf5ec" to="#ffffff" /> */}

      {/* ======= COUNTDOWN ======= */}
      

      {/* <SectionDivider from="#ffffff" to="#ffffff" /> */}

      {/* ======= INVITADOS ======= */}
      {/*<section className="block" style={{ paddingTop: 24 }}>
         <div className="badge-num">3</div>
        <h2 className="section-title">Invitados</h2>
        <p className="section-sub">(1 acompañante)</p>
        <ul className="guest-list">
          <li>Valentina Ruiz</li>
          <li>Agustín Ruiz</li>
        </ul> 
        <p className="guest-foot">Será un día inolvidable y queremos vivirlo contigo.</p>
      </section>

      <SectionDivider from="#ffffff" to="#ffffff" />*/}

      {/* ======= EVENT CARDS ======= */}
      {/* <div className="events">
        
        <div className="event-card">
          <div className="event-icon"><PartyIcon /></div>
          <h3>Celebración</h3>
          <AdornoSmall className="event-divider" />
          <p className="event-sub">Día</p>
          <p className="event-detail">Sábado 15 de Mayo&nbsp;-&nbsp;20h</p>
          <button className="btn-pill" onClick={() => setModal("agenda2")}>Agendar</button>
          <p className="event-sub">Lugar</p>
          <p className="event-detail">Salón de fiestas Avril<br />Av. Los Reartes 12<br />Barcelona</p>
          <button className="btn-pill" onClick={() => setModal("map2")}>¿Cómo llegar?</button>
        </div>
      </div> */}

      <SectionDivider from="#ffffff" to="#ffffff" />
      
      <section className="confirm animate-in">
        <div ref={eventCardRef} className={`event-card ${eventInView ? 'animate-in' : ''}`}>
          <div className="event-icon"><RingsIcon /></div>
          <h3>Ceremonia<br/>&<br/>Celebración</h3>
          <AdornoSmall className="event-divider" />
          <p className="event-sub">Día</p>
          <p className="event-detail">Sábado 03 de Julio&nbsp;-&nbsp;19:00h</p>
          <button className="btn-pill" onClick={() => setModal("agenda1")}>Agendar</button>
          <p className="event-sub">Lugar</p>
          <p className="event-detail">Vara Restaurante & Eventos<br />A-42, Km 31, 45200<br />Illescas<br />Toledo</p>
          <button className="btn-pill" onClick={() => setModal("map1")}>¿Cómo llegar?</button>
        </div>
      </section>      

      {/* <SectionDivider from="#ffffff" to="#ffffff" /> */}

      {/* ======= CONFIRMAR ASISTENCIA ======= */}
      <section className="confirm animate-in">
        {/* <h2 className="section-title">Confirmación de asistencia</h2>
        <p className="lead event-detail">Es importante que confirmes tu asistencia</p>
        <button className="btn-pill lg" onClick={() => setModal("confirm")}>Confirmar asistencia</button> */}


      <div className="event-card">
          <h3>Confirmación de asistencia</h3>
          <AdornoSmall className="event-divider" />
          <p className="event-detail">Es importante que confirmes tu asistencia</p>
          <button className="btn-pill lg" onClick={() => setModal("confirm")}>Confirmar asistencia</button>
        </div>

      </section>

      {/* <SectionDivider from="#ffffff" to="#ffffff" /> */}

      {/* ======= GALERÍA ======= */}
      <Gallery ref={galleryRef} inView={galleryInView} photos={photos} onOpen={(i) => setLightbox(i)} />

      <SectionDivider from="#ffffff" to="#ffffff" />

      {/* ======= FIESTA ======= */}
      <section ref={fiestaRef} className={`fiesta-intro ${fiestaInView ? 'animate-in' : ''}`}>
        <h2 className="section-title">Toma nota...</h2>
        <p className="lead">Hagamos juntos una fiesta única. Os dejamos algunos detalles a tener en cuenta.</p>
      </section>

      <div className="fiesta-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* <FiestaCard title="Música" icon={<MusicNote />} text="¿Cuál es la canción que no debe faltar en la playlist de la fiesta?" cta="Sugerir canción" onClick={() => setModal("musica")} /> */}
        {/* <FiestaCard title="Dress Code" icon={<BowTie />} text="Una orientación para tu vestuario" cta="Ver más" onClick={() => setModal("dress")} /> */}
        <FiestaCard inView={fiestaInView} large title="Tips y Notas" icon={<ClipboardIcon />} text="Información adicional para tener en cuenta" cta="+ Info" onClick={() => setModal("tips")} />
        <FiestaCard inView={fiestaInView} large title="Alojamientos" icon={<HotelIcon />} text="Opciones de hospedaje recomendadas" cta="+ Info" onClick={() => setModal("alojamientos")} />
      </div>

      {/* <div className="fiesta-grid two">
        <FiestaCard large title="Traslados" icon={<BusIcon />} text="Información sobre transporte y traslados" cta="+ Info" onClick={() => setModal("traslados")} />        
      </div> */}

      <SectionDivider from="#ffffff" to="#ffffff" />

      {/* ======= REGALOS ======= */}
      <section ref={giftsRef} className={`gifts ${giftsInView ? 'animate-in' : ''}`}>
        <h2 className="section-title">Regalos</h2>
        <p className="lead">Si deseáis regalarnos algo más que vuestra hermosa presencia&hellip;</p>
        <div className="gift-icon"><GiftIcon /></div>
        <button className="btn-pill lg" onClick={() => setModal("regalos")}>Número de IBAN</button>
      </section>

      <SectionDivider from="#ffffff" to="#ffffff" />

      {/* ======= INSTAGRAM ======= */}
      <section ref={igRef} className={`ig ${igInView ? 'animate-in' : ''}`}>
        <h2 className="section-title">Compartimos este día junto a ti</h2>
        <p className="lead">Comparte tus fotos y vídeos de este hermoso día</p>
        <div className="ig-icon"><InstagramIcon /></div>
        <a className="hashtag" href="#" onClick={() => window.open("https://www.instagram.com/explore/tags/eugenio&esther/", "_blank")}>#eugenio&esther</a>
        <div><button className="btn-pill" onClick={() => window.open("https://www.instagram.com/explore/tags/eugenio&esther/", "_blank")}>Ver en Instagram</button></div>
      </section>

      <SectionDivider from="#ffffff" to="#ffffff" />


      {/* ======= FOOTER ======= */}
      <footer className="footer">
        <div className="footer-brand">
          <p className="footer-names">Eugenio<span className="amp">&amp;</span>Esther</p>
          <div className="footer-rule"></div>
          <p className="footer-sub">03 de Julio de 2027</p>
        </div>
        <ul className="footer-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("confirm"); }}>Confirmar asistencia</a></li>
          {/* <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("musica"); }}>Sugerir canción</a></li> */}
          {/* <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("agenda2"); }}>Agendar Fiesta</a></li> */}
          <li><a href="#" onClick={(e) => { e.preventDefault(); setModal("agenda1"); }}>Agendar Ceremonia</a></li>
        </ul>
        <div className="credit">
          Desarrollado con <span className="heart">♥</span>
        </div>
      </footer>

      {/* ======= MODALS ======= */}
      <ConfirmModal open={modal === "confirm"} onClose={() => setModal(null)} onSubmit={() => { setModal(null); window.open("https://wa.me/34685976684?text=" + (document.querySelector('.txtAsistenteAcompanante').value != '' ? "Somos " : "Soy ") + document.querySelector('.txtAsistentePrincipal').value + (document.querySelector('.txtAsistenteAcompanante').value ? " y " + document.querySelector('.txtAsistenteAcompanante').value : "") + " Quiero confirmar mi asistencia a vuestra boda 🥳" + (document.querySelector('.txtAsistenteRestriccionesAlimentarias').value ? " Tengo restricciones alimentarias: " + document.querySelector('.txtAsistenteRestriccionesAlimentarias').value : ""), "_blank"); }} />
      <SimpleModal open={modal === "musica"} onClose={() => setModal(null)} title="Sugerir Canción" icon={<MusicNote />}>
        <p className="modal-sub">¿Qué canción no puede faltar?</p>
        <input className="modal-field" placeholder="Nombre del invitado" />
        <input className="modal-field" placeholder="Canción y artista" />
        <button className="btn-pill" onClick={() => { setModal(null); showToast("¡Canción sugerida!"); }}>Enviar sugerencia</button>
      </SimpleModal>
      <SimpleModal open={modal === "dress"} onClose={() => setModal(null)} title="Dress Code" icon={<BowTie />}>
        <p style={{ fontFamily: "Quattrocento", fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
          <strong>Etiqueta formal.</strong><br />Tonos sobrios y elegantes. <br />Se solicita evitar el blanco (reservado para la novia) y los tonos dorados muy cercanos a la paleta del evento.
        </p>
      </SimpleModal>
      <SimpleModal open={modal === "tips"} onClose={() => setModal(null)} title="Tips y Notas" icon={<ClipboardIcon />}>
        <ul style={{ textAlign: "left", fontFamily: "Quattrocento", fontSize: 13, color: "var(--ink)", lineHeight: 1.7, paddingLeft: 18 }}>
          <li>La ceremonia comenzará a las 19h.</li>
          <li>Habrá servicio de guardarropa en la entrada.</li>
          <li>El evento es exclusivo para adultos.</li>
          <li>Se solicita evitar el uso del teléfono durante la ceremonia.</li>
        </ul>
      </SimpleModal>
      <SimpleModal open={modal === "traslados"} onClose={() => setModal(null)} title="Traslados" icon={<BusIcon />}>
        <p style={{ fontFamily: "Quattrocento", fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
          Habrá un servicio de autobús desde la <strong>Plaza Catalunya</strong> a las 16:00h hacia la parroquia, y otro al finalizar la celebración de regreso al centro de Barcelona.
        </p>
      </SimpleModal>
      <SimpleModal
        open={modal === "alojamientos"}
        onClose={() => setModal(null)}
        title="Alojamientos"
        icon={<HotelIcon />}
      >
        <p
          style={{
            fontFamily: "Quattrocento",
            fontSize: 13,
            color: "var(--ink)",
            lineHeight: 1.8,
          }}
        >
          Hemos localizado los mejores alojamientos cercanos:
          <br />
          <br />

          <strong>
            <a
              className="modal-link"
              href="https://hotelroute42.com-hotel.com/es/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hotel Alda Route 42
            </a>
          </strong>
          {" · "}15 min a pie
          <br />

          <strong>
            <a
              className="modal-link"
              href="https://complejoparis.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Complejo París
            </a>
          </strong>
          {" · "}10 min en coche

          <br />
          <br />
        </p>
      </SimpleModal>
      <SimpleModal open={modal === "regalos"} onClose={() => setModal(null)} title="Regalos" icon={<GiftIcon />}>
        <p style={{ fontFamily: "Quattrocento", fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
          Vuestra presencia es nuestro mejor regalo. Si aun así deseáis colaborar:
        </p>
        <div style={{ background: "#faf5ec", padding: 14, borderRadius: 4, margin: "14px 0", textAlign: "left", fontFamily: "Karla, sans-serif", fontSize: 12 }}>
          <strong>IBAN</strong><br />
          ES12 3456 7890 1234 5678 9012<br /><br />
          <strong>Titulares</strong><br />Eugenio &amp; Esther
        </div>
        <button className="btn-pill" onClick={() => { navigator.clipboard?.writeText("ES12 3456 7890 1234 5678 9012"); showToast("IBAN copiado al portapapeles"); }}>Copiar IBAN</button>
      </SimpleModal>
      <SimpleModal open={modal === "agenda1" || modal === "agenda2"} onClose={() => setModal(null)} title="Agendar evento" icon={modal === "agenda1" ? <RingsIcon /> : <PartyIcon />}>
        <p style={{ fontFamily: "Quattrocento", fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>
          Añade el evento a tu calendario:
        </p>
        <div className="modal-row" style={{ flexDirection: "column", gap: 8 }}>
          <button className="btn-pill" onClick={() => { setModal(null); showToast("Evento añadido a Google Calendar"); }}>Google Calendar</button>
          <button className="btn-pill outline" onClick={() => { setModal(null); showToast("Archivo .ics descargado"); }}>Apple / Outlook (.ics)</button>
        </div>
      </SimpleModal>
      <MapModal open={modal === "map1" || modal === "map2"} onClose={() => setModal(null)} place={modal === "map1" ? "Vara Restaurante & Eventos" : "Salón de fiestas Avril"} address={modal === "map1" ? "A-42, Km 31, Illecas. 45200 Toledo" : "Av. Los Reartes 12 - Barcelona"} />

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox open" onClick={() => setLightbox(null)}>
          <button className="close" onClick={() => setLightbox(null)}>×</button>
          <button className="nav prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}>‹</button>
          <img src={photos[lightbox]} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="nav next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}>›</button>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

// ------- Gallery carousel -------
function Gallery(props) {
  const { photos, onOpen, inView } = props;
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(id);
  }, [photos.length]);

  // touch swipe
  const startX = useRef(null);
  const onStart = (e) => { startX.current = e.touches ? e.touches[0].clientX : e.clientX; };
  const onEnd = (e) => {
    if (startX.current == null) return;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = x - startX.current;
    if (Math.abs(dx) > 30) {
      if (dx < 0) setIdx((i) => (i + 1) % photos.length);
      else setIdx((i) => (i - 1 + photos.length) % photos.length);
    }
    startX.current = null;
  };

  return (
    <section ref={ref} className={`gallery-wrap ${inView ? 'animate-in' : ''}`}>
      <h2 className="section-title">Retratos de Nuestro Amor</h2>
      <p className="lead">Un minuto, un segundo, un instante que queda en la eternidad</p>
      <div className="camera-icon"><CameraIcon /></div>

      <div className="carousel" onTouchStart={onStart} onTouchEnd={onEnd} onMouseDown={onStart} onMouseUp={onEnd}>
        <div className="carousel-track">
          {photos.map((src, i) => {
            const rel = ((i - idx) + photos.length) % photos.length;
            const order = rel > photos.length / 2 ? rel - photos.length : rel;
            const abs = Math.abs(order);
            if (abs > 2) return null;
            const translate = order * 95;
            const scale = order === 0 ? 1.1 : 0.78;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.4;
            const z = 10 - abs;
            return (
              <div
                key={i}
                className="slide"
                style={{
                  transform: `translateX(${translate}px) scale(${scale})`,
                  opacity, zIndex: z,
                  boxShadow: order === 0
                    ? "0 12px 30px rgba(40, 30, 10, 0.25)"
                    : "0 6px 16px rgba(40, 30, 10, 0.18)",
                  background: order === 0 ? "var(--gold)" : "var(--card)",
                }}
                onClick={() => order === 0 ? onOpen(i) : setIdx(i)}
              >
                <img src={src} alt="" loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="dots">
        {photos.map((_, i) => (
          <button key={i} className={`dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </section>
  );
}

function FiestaCard({ title, icon, text, cta, onClick, large, inView }) {
  return (
    <div className={`fiesta-card ${large ? "large" : ""} ${inView ? 'animate-in' : ''}`}>
      <h4>{title}</h4>
      <div className="fiesta-icon">{icon}</div>
      <p>{text}</p>
      <button className="btn-pill" onClick={onClick}>{cta}</button>
    </div>
  );
}

// ------- Modal shells -------
function SimpleModal({ open, onClose, title, icon, children }) {
  // close on Esc
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div className={`modal-backdrop ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-icon">{icon}</div>
        <h3>{title}</h3>
        <AdornoSmall className="divider" />
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ open, onClose, onSubmit }) {
  const [going, setGoing] = useState(null);

  useEffect(() => {
    if (open) setGoing(null);
  }, [open]);

  return (
    <SimpleModal open={open} onClose={onClose} title="Confirmar Asistencia" icon={<HeartIcon />}>
      <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "var(--gold-deep)", margin: "0 0 18px", fontSize: 14 }}>
        ¿Nos acompañarás en nuestro gran día?
      </p>
      <div className="modal-row" style={{ marginBottom: 18 }}>
        <button
          className={`btn-pill ${going === true ? "" : "outline"}`}
          onClick={() => setGoing(true)}
        >Sí, allí estaré</button>
        <button
          className={`btn-pill ${going === false ? "" : "outline"}`}
          onClick={() => setGoing(false)}
        >No podré asistir</button>
      </div>
      {going !== null && (
        <>
          <input className="modal-field txtAsistentePrincipal" placeholder="Tu nombre" />
          {going && (
            <>
              <input className="modal-field txtAsistenteAcompanante" placeholder="Acompañante (opcional)" />
              <input className="modal-field txtAsistenteRestriccionesAlimentarias" placeholder="Restricciones alimentarias" />
            </>
          )}
          <button className="btn-pill lg" onClick={onSubmit} style={{ marginTop: 6 }}>
            {going ? "Confirmar" : "Enviar"}
          </button>
        </>
      )}
    </SimpleModal>
  );
}

function MapModal({ open, onClose, place, address }) {
  return (
    <SimpleModal open={open} onClose={onClose} title={place} icon={
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M24 6 C 16 6, 10 12, 10 20 C 10 30, 24 42, 24 42 C 24 42, 38 30, 38 20 C 38 12, 32 6, 24 6 Z" />
        <circle cx="24" cy="20" r="5" />
      </svg>
    }>
      <p style={{ fontFamily: "Karla, sans-serif", fontSize: 12, color: "var(--ink-soft)", margin: "0 0 14px" }}>{address}</p>
        <div
          style={{
            height: 300,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.2399947399226!2d-3.8229810236076127!3d40.1592099712721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd41f0fb53100e8d%3A0xb43087d21c660557!2sVara%20Restaurante%20%26%20Eventos!5e0!3m2!1ses!2ses!4v1781039870428!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Vara Restaurante & Eventos"
          />
        </div>
      <button
        className="btn-pill"
        onClick={() => {
          window.open(
            "https://maps.google.com/?q=Vara+Restaurante+Eventos+Illescas",
            "_blank"
          );
        }}
      >Ampliar mapa</button>
    </SimpleModal>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById("app")).render(<Invitation />);

export default Invitation;
