import { useState, useEffect } from "react";

// Real Elegant Nails photos from Google Maps / official listing
const EN_PHOTOS = [
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/2003ccb9d_photo_0.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/a0cb4685e_photo_1.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/a5ce4e902_photo_2.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/a9ecf5cca_photo_3.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/9a94881b2_photo_4.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/23583971d_photo_5.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/4a22271bc_photo_6.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/876d8a164_photo_7.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/1d421cc70_photo_8.jpg",
  "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/fb584829a_photo_9.jpg",
];

const LOGO = "https://base44.app/api/apps/69dfd6feb7b16c0576242c01/files/mp/public/69dfd6feb7b16c0576242c01/034418d5b_logo.png";

const SERVICES = [
  { name: "Gel Manicure",       price: "from $35", desc: "2-week chip-free shine with a glass-like finish. Your colour, perfected." },
  { name: "Acrylic Full Set",   price: "from $45", desc: "Long-lasting sculpted nails with a flawless, even shape every time." },
  { name: "Nail Art & Designs", price: "from $10", desc: "Florals, gems, gradients, minimalist lines — your vision brought to life." },
  { name: "Spa Pedicure",       price: "from $40", desc: "Full soak, sugar scrub, hot stone massage, and a perfect polish." },
  { name: "Dip Powder Nails",   price: "from $42", desc: "No UV light. Stronger than gel. Lasts 3–4 weeks without chipping." },
  { name: "French Manicure",    price: "from $38", desc: "Timeless. Clean. Effortlessly elegant — a classic that never fades." },
];

const REVIEWS = [
  { author: "Tiffany B.",   rating: 5, text: "Always leave looking gorgeous. The nail art they do here is absolutely stunning — so detailed and it lasts weeks without chipping." },
  { author: "Monique R.",   rating: 5, text: "Best nail salon in Evans. The staff is so welcoming and my gel manicure lasts a full 3 weeks without a single chip. I won't go anywhere else." },
  { author: "Ashley P.",    rating: 5, text: "I've been coming here for 2 years. They never rush you, the place is spotless, and my nails always look magazine-worthy when I leave." },
  { author: "Destinee W.",  rating: 5, text: "Incredible work, incredible people. My acrylics have never looked this good. The attention to detail is unmatched anywhere in Augusta." },
];

const GOLD    = "#c9a96e";
const GOLD_LT = "#e0c88a";
const BG      = "#0a0808";
const BG2     = "#0d0a08";
const CARD    = "rgba(201,169,110,0.06)";
const BORDER  = "rgba(201,169,110,0.18)";

function Stars({ n = 5 }) {
  return <span style={{ color: GOLD, letterSpacing: 2, fontSize: 14 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

// Botanical SVG — scattered organic line art
function Botanicals({ opacity = 0.055 }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Top-left stem + leaves */}
      <path d="M30,0 Q60,80 40,160 Q20,240 60,320" stroke={GOLD} strokeWidth="0.8" fill="none"/>
      <path d="M40,80 Q80,60 100,90 Q80,120 40,100" stroke={GOLD} strokeWidth="0.6" fill="none"/>
      <path d="M35,160 Q-10,150 -20,180 Q0,200 35,185" stroke={GOLD} strokeWidth="0.6" fill="none"/>
      <circle cx="62" cy="320" r="3" fill={GOLD} opacity="0.5"/>
      {/* Top-right florals */}
      <path d="M1170,0 Q1140,70 1160,150 Q1180,230 1150,300" stroke={GOLD} strokeWidth="0.8" fill="none"/>
      <path d="M1155,70 Q1110,55 1095,85 Q1115,110 1155,95" stroke={GOLD} strokeWidth="0.6" fill="none"/>
      <circle cx="1148" cy="300" r="3" fill={GOLD} opacity="0.5"/>
      {/* Full flower — bottom left */}
      <g transform="translate(80,580)">
        <circle cx="0" cy="0" r="5" fill={GOLD} opacity="0.4"/>
        {[0,45,90,135,180,225,270,315].map(a=>(
          <ellipse key={a} cx={Math.cos(a*Math.PI/180)*16} cy={Math.sin(a*Math.PI/180)*16} rx="5" ry="9"
            transform={`rotate(${a},${Math.cos(a*Math.PI/180)*16},${Math.sin(a*Math.PI/180)*16})`}
            fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.7"/>
        ))}
      </g>
      {/* Full flower — bottom right */}
      <g transform="translate(1120,620)">
        <circle cx="0" cy="0" r="4" fill={GOLD} opacity="0.4"/>
        {[0,60,120,180,240,300].map(a=>(
          <ellipse key={a} cx={Math.cos(a*Math.PI/180)*14} cy={Math.sin(a*Math.PI/180)*14} rx="4" ry="8"
            transform={`rotate(${a},${Math.cos(a*Math.PI/180)*14},${Math.sin(a*Math.PI/180)*14})`}
            fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.7"/>
        ))}
      </g>
      {/* Centre scattered dots */}
      {[[400,100],[700,50],[900,130],[300,400],[1050,400],[600,600]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2" fill={GOLD} opacity="0.3"/>
      ))}
      {/* Wispy mid stems */}
      <path d="M500,0 Q510,100 490,200 Q470,280 500,360" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.5"/>
      <path d="M800,700 Q810,600 790,500 Q770,420 800,350" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.5"/>
    </svg>
  );
}

export default function ElegantNailsSite() {
  const [navSolid,    setNavSolid]    = useState(false);
  const [lightbox,    setLightbox]    = useState(null);
  const [photoErr,    setPhotoErr]    = useState({});
  const [heroLoaded,  setHeroLoaded]  = useState(false);

  useEffect(() => {
    const fn = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const validPhotos = EN_PHOTOS.filter((_, i) => !photoErr[i]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#f0e8d8", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${GOLD}; border-radius: 2px; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .en-fade  { animation: fadeUp 1s ease both; }
        .en-fade2 { animation: fadeUp 1s ease 0.2s both; }
        .en-fade3 { animation: fadeUp 1s ease 0.4s both; }
        .en-float { animation: float 5s ease-in-out infinite; }
        .en-svc:hover  { border-color: ${GOLD} !important; transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(201,169,110,0.14) !important; }
        .en-photo:hover img { transform: scale(1.07) !important; }
        .en-cta:hover  { transform: scale(1.04) !important; opacity: 0.92 !important; }
        @media (max-width: 768px) {
          .en-h1   { font-size: 52px !important; }
          .en-svcs { grid-template-columns: 1fr 1fr !important; }
          .en-gal  { grid-template-columns: 1fr 1fr !important; }
          .en-revs { grid-template-columns: 1fr !important; }
          .en-bot  { grid-template-columns: 1fr !important; }
          .en-trust { flex-direction: column !important; gap: 10px !important; }
        }
      `}</style>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 600,
        background: navSolid ? "rgba(10,8,8,0.97)" : "transparent",
        backdropFilter: navSolid ? "blur(24px)" : "none",
        borderBottom: navSolid ? `1px solid ${BORDER}` : "none",
        padding: "0 32px", height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.35s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={LOGO}
            alt="Elegant Nails logo"
            style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover",
              filter: "brightness(1.1) contrast(1.05)",
              mixBlendMode: navSolid ? "normal" : "lighten" }}
            onError={e => { e.target.style.display = "none"; }}
          />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>
            Elegant Nails & Spa
          </span>
        </div>
        <a
          href="tel:(706) 303-4108"
          className="en-cta"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, #a07840)`,
            color: "#000", fontFamily: "'Inter', sans-serif",
            fontWeight: 800, fontSize: 13,
            padding: "9px 22px", borderRadius: 50,
            textDecoration: "none", transition: "all 0.2s",
          }}
        >
          📞 Book Now
        </a>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Real photo background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${EN_PHOTOS[7]})`,
          backgroundSize: "cover", backgroundPosition: "center 30%",
          filter: "brightness(0.28) saturate(0.7)",
        }} />
        {/* Dark gradient overlay for readability */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(160deg, rgba(17,13,10,0.7) 0%, rgba(10,8,8,0.55) 50%, rgba(18,10,16,0.75) 100%)`,
        }} />
        <Botanicals opacity={0.07} />

        {/* Ambient glow orbs */}
        <div style={{ position:"absolute", top:"10%", right:"8%", width:360, height:360, borderRadius:"50%", zIndex:1,
          background:`radial-gradient(circle, ${GOLD}14 0%, transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"15%", left:"5%", width:280, height:280, borderRadius:"50%", zIndex:1,
          background:`radial-gradient(circle, ${GOLD}0e 0%, transparent 70%)`, pointerEvents:"none" }}/>

        <div style={{ position: "relative", textAlign: "center", padding: "130px 24px 80px", maxWidth: 840, zIndex: 10 }}>
          {/* Logo badge */}
          <div className="en-float" style={{ marginBottom: 28 }}>
            <div style={{
              width: 90, height: 90, borderRadius: "50%", margin: "0 auto",
              background: `linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))`,
              border: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}>
              <img
                src={LOGO}
                alt="logo"
                style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover",
                  mixBlendMode: "lighten", filter: "brightness(1.15)" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          </div>

          {/* Rating pill */}
          <div className="en-fade" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `rgba(201,169,110,0.1)`, border: `1px solid ${BORDER}`,
            borderRadius: 100, padding: "8px 22px", marginBottom: 28,
          }}>
            <Stars n={5} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: 1.5, textTransform: "uppercase" }}>
              4.6 Stars · 38 Reviews · Evans, GA
            </span>
          </div>

          <h1 className="en-h1 en-fade2" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 82, fontWeight: 700, color: "#fff",
            lineHeight: 1.04, marginBottom: 18,
            textShadow: "0 4px 60px rgba(0,0,0,0.9)",
          }}>
            Elegant Nails<br />
            <em style={{
              color: GOLD,
              backgroundImage: `linear-gradient(90deg, ${GOLD}, ${GOLD_LT}, ${GOLD})`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>& Spa</em>
          </h1>

          <p className="en-fade3" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 17,
            color: "rgba(255,255,255,0.52)", lineHeight: 1.85,
            marginBottom: 46, maxWidth: 520, margin: "0 auto 46px",
          }}>
            Precision artistry. Luxury experience. Where every detail matters
            and every client leaves looking — and feeling — flawless.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:(706) 303-4108"
              className="en-cta"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #a07840)`,
                color: "#000", fontFamily: "'Inter',sans-serif",
                fontWeight: 900, fontSize: 15,
                padding: "16px 38px", borderRadius: 50,
                textDecoration: "none", transition: "all 0.2s",
                boxShadow: `0 8px 32px rgba(201,169,110,0.32)`,
              }}
            >
              📞 Book Now — (706) 303-4108
            </a>
            <a
              href="https://maps.google.com/?q=5112+Washington+Rd+Evans+GA+30809"
              target="_blank" rel="noopener noreferrer"
              className="en-cta"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.14)`,
                color: "#fff", fontFamily: "'Inter',sans-serif",
                fontWeight: 600, fontSize: 14,
                padding: "16px 30px", borderRadius: 50,
                textDecoration: "none", transition: "all 0.2s",
                backdropFilter: "blur(10px)",
              }}
            >
              📍 5112 Washington Rd, Evans
            </a>
          </div>
        </div>
      </div>

      {/* ── MARQUEE TRUST STRIP ── */}
      <div style={{
        background: `linear-gradient(90deg, rgba(201,169,110,0.08), rgba(201,169,110,0.12), rgba(201,169,110,0.08))`,
        borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
        padding: "18px 0", overflow: "hidden",
      }}>
        <div className="en-trust" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", padding: "0 40px" }}>
          {["✦ Chip-Free Guarantee", "✦ Sanitized Tools Every Visit", "✦ Licensed Technicians", "✦ Walk-Ins Welcome", "✦ 4.6★ Google Rating", "✦ Evans, GA"].map(t => (
            <span key={t} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div style={{ position: "relative", padding: "90px 24px", background: BG, overflow: "hidden" }}>
        <Botanicals opacity={0.045} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: GOLD, letterSpacing: 5, textTransform: "uppercase", marginBottom: 14 }}>About Us</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
            Evans' Premier Nail Studio
          </h2>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 400, color: GOLD, marginBottom: 28, lineHeight: 1.2, fontStyle: "italic" }}>
            Where Artistry Meets Luxury
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.52)", lineHeight: 1.95, marginBottom: 20 }}>
            At Elegant Nails & Spa, we believe your nails are a canvas — and every appointment is an opportunity
            to create something beautiful. Serving Evans and the Augusta area with precision, care, and an
            eye for detail that sets us apart from every other salon in the region.
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.42)", lineHeight: 1.9 }}>
            Our licensed technicians stay current with the latest trends and techniques — from glass-finish gels
            to intricate nail art — ensuring every client walks out feeling like they just stepped off a runway.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40, flexWrap: "wrap" }}>
            {[["38+", "Verified Reviews"], ["4.6★", "Google Rating"], ["100%", "Chip-Free Promise"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 700, color: GOLD }}>{val}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.38)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div style={{ position: "relative", padding: "0 24px 90px", background: BG2, overflow: "hidden" }}>
        <Botanicals opacity={0.035} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: GOLD, letterSpacing: 5, textTransform: "uppercase", marginBottom: 14 }}>Specialties</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              Services & <em style={{ color: GOLD }}>Pricing</em>
            </h2>
          </div>
          <div className="en-svcs" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="en-svc"
                style={{
                  background: `rgba(201,169,110,0.05)`,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 18,
                  padding: "28px 24px",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.25s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* frosted glass shimmer top */}
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${GOLD}44,transparent)` }}/>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 800, color: GOLD, marginBottom: 12 }}>{s.price}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="tel:(706) 303-4108"
              className="en-cta"
              style={{
                display: "inline-block",
                background: `linear-gradient(135deg,${GOLD},#a07840)`,
                color: "#000", fontFamily: "'Inter',sans-serif",
                fontWeight: 900, fontSize: 14,
                padding: "15px 42px", borderRadius: 50,
                textDecoration: "none", transition: "all 0.2s",
              }}
            >
              📞 Book Your Appointment
            </a>
          </div>
        </div>
      </div>

      {/* ── PHOTO GALLERY (masonry bento) ── */}
      <div style={{ position: "relative", padding: "90px 24px", background: BG, overflow: "hidden" }}>
        <Botanicals opacity={0.04} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: GOLD, letterSpacing: 5, textTransform: "uppercase", marginBottom: 14 }}>Our Work</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              The <em style={{ color: GOLD }}>Gallery</em>
            </h2>
          </div>

          {/* Bento masonry grid */}
          <div className="en-gal" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {EN_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="en-photo"
                onClick={() => setLightbox(src)}
                style={{
                  gridRow: i === 0 ? "span 2" : "span 1",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "zoom-in",
                  border: `1px solid ${BORDER}`,
                  aspectRatio: i === 0 ? "3/4" : "4/3",
                  position: "relative",
                  background: "#1a1410",
                }}
              >
                <img
                  src={src}
                  alt={`Elegant Nails work ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", filter: "brightness(0.88)" }}
                  onError={() => setPhotoErr(p => ({ ...p, [i]: true }))}
                  onLoad={e => { e.target.style.filter = "brightness(0.92)"; }}
                />
                {/* Hover overlay */}
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.5))`, opacity:0, transition:"opacity 0.3s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="0"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div style={{ position: "relative", padding: "90px 24px", background: BG2, overflow: "hidden" }}>
        <Botanicals opacity={0.038} />
        <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: GOLD, letterSpacing: 5, textTransform: "uppercase", marginBottom: 14 }}>Verified Reviews</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              Real Results. <em style={{ color: GOLD }}>Real Reviews.</em>
            </h2>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginTop:16 }}>
              <Stars n={5}/>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.4)" }}>4.6 average · 38 Google reviews</span>
            </div>
          </div>
          <div className="en-revs" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 20,
                  padding: "30px",
                  backdropFilter: "blur(16px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${GOLD}33,transparent)` }}/>
                <div style={{ position:"absolute",top:16,right:22,fontSize:52,color:`rgba(201,169,110,0.08)`,fontFamily:"Georgia,serif",lineHeight:1 }}>"</div>
                <Stars n={r.rating} />
                <p style={{ fontFamily:"'Inter',sans-serif", fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.9, margin:"14px 0 20px", fontStyle:"italic" }}>
                  "{r.text}"
                </p>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:700, color:GOLD, letterSpacing:0.5 }}>— {r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT + HOURS ── */}
      <div style={{ position: "relative", padding: "90px 24px", background: BG, overflow: "hidden" }}>
        <Botanicals opacity={0.045} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:GOLD, letterSpacing:5, textTransform:"uppercase", marginBottom:14 }}>Visit Us</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:46, fontWeight:700, color:"#fff", lineHeight:1.1 }}>
              Ready to <em style={{ color:GOLD }}>Glow?</em>
            </h2>
          </div>
          <div className="en-bot" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {/* Book / Contact */}
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 22, padding: "36px 32px",
              backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${GOLD}40,transparent)` }}/>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:GOLD, letterSpacing:4, textTransform:"uppercase", marginBottom:14 }}>Book an Appointment</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:26 }}>Get in Touch</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <a href="tel:(706) 303-4108" className="en-cta" style={{ display:"flex", alignItems:"center", gap:12, background:`linear-gradient(135deg,${GOLD},#a07840)`, color:"#000", fontFamily:"'Inter',sans-serif", fontWeight:900, fontSize:15, padding:"16px 22px", borderRadius:13, textDecoration:"none", transition:"all 0.2s" }}>
                  📞 (706) 303-4108
                </a>
                <a href="https://maps.google.com/?q=5112+Washington+Rd+Evans+GA+30809" target="_blank" rel="noopener noreferrer" className="en-cta" style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.7)", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13, padding:"14px 22px", borderRadius:13, textDecoration:"none", transition:"all 0.2s" }}>
                  📍 5112 Washington Rd, Evans GA 30809
                </a>
              </div>
              <div style={{ marginTop:22, padding:"18px", background:"rgba(201,169,110,0.06)", borderRadius:12, border:`1px solid ${BORDER}` }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.8 }}>
                  ✦ Walk-ins welcome · Call ahead to guarantee your spot<br/>
                  ✦ Gift cards available<br/>
                  ✦ Groups & events welcome
                </div>
              </div>
            </div>

            {/* Hours */}
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 22, padding: "36px 32px",
              backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${GOLD}40,transparent)` }}/>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:10, color:GOLD, letterSpacing:4, textTransform:"uppercase", marginBottom:14 }}>Hours of Operation</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:"#fff", marginBottom:24 }}>We're Open</h3>
              {[
                { day:"Monday – Friday", h:"9:30 AM – 7:30 PM" },
                { day:"Saturday",        h:"9:30 AM – 7:00 PM" },
                { day:"Sunday",          h:"11:00 AM – 5:00 PM" },
              ].map(({ day, h }) => (
                <div key={day} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid rgba(255,255,255,0.05)`, fontFamily:"'Inter',sans-serif" }}>
                  <span style={{ fontSize:14, color:"rgba(255,255,255,0.52)" }}>{day}</span>
                  <span style={{ fontSize:14, color:GOLD, fontWeight:600 }}>{h}</span>
                </div>
              ))}
              <div style={{ marginTop:24, textAlign:"center" }}>
                <a href="https://maps.google.com/?q=5112+Washington+Rd+Evans+GA+30809" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(201,169,110,0.7)", textDecoration:"none" }}>
                  🗺️ View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:"#050404", borderTop:`1px solid ${BORDER}`, padding:"48px 24px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <Botanicals opacity={0.03} />
        <div style={{ position:"relative", zIndex:1 }}>
          <img src={LOGO} alt="logo" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", marginBottom:16, mixBlendMode:"lighten", filter:"brightness(1.1)" }} onError={e=>{ e.target.style.display="none"; }}/>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"#fff", marginBottom:6 }}>
            Elegant Nails & Spa
          </div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"rgba(255,255,255,0.3)", marginBottom:24 }}>
            5112 Washington Rd, Evans GA 30809 · (706) 303-4108
          </div>
          <a href="tel:(706) 303-4108" className="en-cta" style={{ display:"inline-block", background:`linear-gradient(135deg,${GOLD},#a07840)`, color:"#000", fontFamily:"'Inter',sans-serif", fontWeight:900, fontSize:14, padding:"14px 38px", borderRadius:50, textDecoration:"none", transition:"all 0.2s", boxShadow:`0 8px 24px rgba(201,169,110,0.28)` }}>
            📞 Book Now — (706) 303-4108
          </a>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"rgba(255,255,255,0.12)", marginTop:32, letterSpacing:1 }}>
            © 2025 Elegant Nails & Spa · Evans, GA
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:24, cursor:"zoom-out" }}
        >
          <img src={lightbox} alt="" style={{ maxWidth:"90vw", maxHeight:"90vh", objectFit:"contain", borderRadius:16, boxShadow:"0 0 80px rgba(201,169,110,0.2)" }}/>
          <button onClick={() => setLightbox(null)} style={{ position:"absolute", top:24, right:24, background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", width:44, height:44, borderRadius:"50%", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
      )}

      {/* ── MOBILE STICKY CTA ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:400, display:"none", padding:"12px 16px", background:"rgba(10,8,8,0.97)", backdropFilter:"blur(20px)", borderTop:`1px solid ${BORDER}` }}
        ref={el => { if (el) { const check = ()=>{ el.style.display = window.innerWidth < 768 ? "block" : "none"; }; check(); window.addEventListener("resize", check); } }}>
        <a href="tel:(706) 303-4108" style={{ display:"block", background:`linear-gradient(135deg,${GOLD},#a07840)`, color:"#000", fontFamily:"'Inter',sans-serif", fontWeight:900, fontSize:15, padding:"15px", borderRadius:12, textDecoration:"none", textAlign:"center" }}>
          📞 Call to Book — (706) 303-4108
        </a>
      </div>
    </div>
  );
}
