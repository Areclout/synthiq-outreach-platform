import { useState, useEffect, useRef } from "react";

const FUNCTIONS_URL = "https://the-bank-76242c01.base44.app/functions";

// ─── SLUG FROM URL ───────────────────────────────────────────────────────────
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("slug")) return params.get("slug");
  const parts = window.location.pathname.split("/");
  const idx = parts.findIndex(p => p === "BusinessSite");
  if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  return null;
}

// ─── THEME MAP ───────────────────────────────────────────────────────────────
const THEMES = {
  "Nail Salon":       { accent:"#c9a96e", bg:"#0a0808", card:"rgba(201,169,110,0.08)", border:"rgba(201,169,110,0.18)", font:"'Playfair Display',Georgia,serif" },
  "Barbershop":       { accent:"#d4af37", bg:"#0a0a0a", card:"rgba(212,175,55,0.07)",  border:"rgba(212,175,55,0.18)",  font:"'Oswald',Impact,sans-serif" },
  "Restaurant":       { accent:"#e07b39", bg:"#0d0807", card:"rgba(224,123,57,0.07)",  border:"rgba(224,123,57,0.18)",  font:"'Lora',Georgia,serif" },
  "Pest Control":     { accent:"#4caf50", bg:"#080d08", card:"rgba(76,175,80,0.07)",   border:"rgba(76,175,80,0.18)",   font:"'Inter',sans-serif" },
  "Pressure Washing": { accent:"#3b82f6", bg:"#060810", card:"rgba(59,130,246,0.07)",  border:"rgba(59,130,246,0.18)",  font:"'Oswald',sans-serif" },
  "Painter":          { accent:"#f4a520", bg:"#0e0c08", card:"rgba(244,165,32,0.07)",  border:"rgba(244,165,32,0.18)",  font:"'Merriweather',Georgia,serif" },
  "Hvac":             { accent:"#38bdf8", bg:"#060810", card:"rgba(56,189,248,0.07)",  border:"rgba(56,189,248,0.18)",  font:"'Inter',sans-serif" },
  "Auto Repair":      { accent:"#ef4444", bg:"#0a0808", card:"rgba(239,68,68,0.07)",   border:"rgba(239,68,68,0.18)",   font:"'Oswald',sans-serif" },
  "Landscaping":      { accent:"#22c55e", bg:"#060c06", card:"rgba(34,197,94,0.07)",   border:"rgba(34,197,94,0.18)",   font:"'Inter',sans-serif" },
  "Cleaning Service": { accent:"#a78bfa", bg:"#06080e", card:"rgba(167,139,250,0.07)", border:"rgba(167,139,250,0.18)", font:"'Inter',sans-serif" },
  "Hair Salon":       { accent:"#ec4899", bg:"#0d080d", card:"rgba(236,72,153,0.07)",  border:"rgba(236,72,153,0.18)",  font:"'Playfair Display',Georgia,serif" },
  "Contractor":       { accent:"#f59e0b", bg:"#0a0a08", card:"rgba(245,158,11,0.07)",  border:"rgba(245,158,11,0.18)",  font:"'Oswald',sans-serif" },
  "default":          { accent:"#818cf8", bg:"#0a0a12", card:"rgba(129,140,248,0.07)", border:"rgba(129,140,248,0.18)", font:"'Inter',sans-serif" },
};

const CAT_EMOJI = {
  "Nail Salon":"💅","Barbershop":"✂️","Restaurant":"🍽️","Pest Control":"🛡️",
  "Pressure Washing":"💦","Auto Repair":"🔧","Painter":"🎨","Hvac":"❄️",
  "Landscaping":"🌿","Cleaning Service":"✨","Hair Salon":"💇","Contractor":"🏗️",
};

const CAT_TAGLINES = {
  "Nail Salon":       "Precision artistry. Luxury experience. Nails that turn heads.",
  "Barbershop":       "Sharp cuts. No compromises. Walk out a different person.",
  "Restaurant":       "Real food. Real flavor. Every bite tells a story.",
  "Pest Control":     "They don't come back. Guaranteed.",
  "Pressure Washing": "Before & after? Night and day. We bring the clean.",
  "Painter":          "Color that transforms. We don't just paint — we perfect.",
  "Hvac":             "Stay comfortable year-round. Reliable service you can count on.",
  "Auto Repair":      "Honest mechanics. No upselling. Your car in good hands.",
  "Landscaping":      "Curb appeal that turns heads. Your yard, transformed.",
  "Cleaning Service": "Spotless. Every time. We clean like we live there.",
  "Hair Salon":       "Your best look, every visit. Style that speaks for itself.",
  "Contractor":       "Built right. Built to last. Quality work, on time.",
  "default":          "Professional service you can trust. Serving the Augusta area.",
};

const CAT_SERVICES = {
  "Nail Salon":       [["Gel Manicure","from $35","2-week chip-free shine with glass-like finish."],["Acrylic Full Set","from $45","Long-lasting sculpted nails with flawless shape."],["Nail Art & Designs","from $10","From minimalist lines to intricate florals."],["Spa Pedicure","from $40","Soak, scrub, massage, polish. Full luxury treatment."],["Dip Powder Nails","from $42","No UV light. Stronger than gel, lasts 3-4 weeks."],["French Manicure","from $38","Timeless. Clean. Effortlessly elegant."]],
  "Barbershop":       [["Signature Fade","from $25","Precise, clean fade tailored to your head shape."],["Classic Haircut","from $20","Sharp, clean lines every time."],["Beard Trim & Shape","from $15","Sculpted edges, clean lines. No guessing."],["Hot Towel Shave","from $30","Old-school luxury. The full experience."],["Line-Up","from $12","Crisp edges that complete the whole look."],["Kid's Cut","from $15","Gentle, patient, and precise for the little ones."]],
  "Restaurant":       [["Dine In","–","Full-service dining with a warm, welcoming atmosphere."],["Takeout & Carryout","–","Hot, fresh food ready when you are."],["Catering","–","We bring the food to your event. Contact us."],["Private Events","–","Book the space for birthdays, meetings, and more."]],
  "Pest Control":     [["Roach & Ant Elimination","Free quote","Full interior treatment, guaranteed results."],["Termite Protection","Free inspection","Protect your home's foundation and structure."],["Mosquito Treatment","Free quote","Enjoy your yard without getting eaten alive."],["Rodent Control","Free quote","We seal entry points and eliminate the problem."],["Quarterly Plan","Ask us","Scheduled treatments that keep pests gone year-round."],["Free Inspection","$0","We'll tell you exactly what you're dealing with."]],
  "Pressure Washing": [["Driveway Cleaning","Free quote","Restore your concrete to like-new condition."],["House Washing","Free quote","Soft wash that won't damage your siding."],["Deck & Patio","Free quote","Remove years of grime, mold, and algae."],["Fence Washing","Free quote","Bring wood and vinyl fences back to life."],["Roof Soft Wash","Free quote","Safe, low-pressure treatment for shingles."],["Commercial","Free quote","Storefronts, parking lots, and more."]],
  "Painter":          [["Interior Painting","Free estimate","Clean lines, rich color, zero mess left behind."],["Exterior Painting","Free estimate","Weather-resistant finish that lasts for years."],["Cabinet Refinishing","Free estimate","Transform your kitchen without a full remodel."],["Deck Staining","Free estimate","Protect and beautify your outdoor space."],["Trim & Detail Work","Free estimate","The finishing touch that makes everything pop."],["Color Consultation","Free","We help you choose. No guessing, no regrets."]],
  "Hvac":             [["AC Installation","Free estimate","New systems installed correctly, the first time."],["Heating Repair","Same-day","Fast diagnostics and expert repair."],["System Maintenance","Ask us","Prevent breakdowns before they happen."],["Duct Cleaning","Free estimate","Improve air quality and system efficiency."],["Emergency Service","24/7","When something breaks, we answer the call."],["Seasonal Tune-Up","Ask us","Get ready for summer or winter before it hits."]],
  "Auto Repair":      [["Oil Change","Quick","In and out. No appointment needed."],["Brake Service","Free quote","Pads, rotors, calipers — we do it all."],["Engine Diagnostics","Free","We scan your codes and tell you exactly what's wrong."],["Tire Rotation","Quick","Even wear means longer-lasting tires."],["AC Repair","Free estimate","Stay cool. We diagnose and fix."],["Full Inspection","Free","Bumper-to-bumper check before any work begins."]],
  "Landscaping":      [["Lawn Mowing","Free quote","Consistent, clean cuts on your schedule."],["Hedge Trimming","Free quote","Crisp edges and shaped shrubs."],["Landscape Design","Free estimate","Transform your yard from the ground up."],["Mulching","Free quote","Keep moisture in, weeds out."],["Sod Installation","Free estimate","Instant lawn, zero wait."],["Leaf Removal","Free quote","We haul it away. You just enjoy the yard."]],
  "Cleaning Service": [["Deep House Cleaning","Free quote","Every surface, every corner. Spotless guaranteed."],["Move-In/Out Clean","Free quote","Leave it better than you found it."],["Weekly Maintenance","Free quote","Consistent cleanliness on your schedule."],["Office Cleaning","Free quote","Professional spaces deserve professional cleaning."],["Carpet Cleaning","Free quote","Deep-extract dirt, stains, and allergens."],["Window Washing","Free quote","Crystal clear, streak-free results."]],
  "Hair Salon":       [["Haircut & Style","Free consult","Precision cuts tailored to your face shape."],["Color & Highlights","Free consult","Rich, dimensional color that turns heads."],["Balayage","Free consult","Natural sun-kissed color, hand-painted."],["Keratin Treatment","Free consult","Smooth, frizz-free hair for months."],["Blow Dry & Style","Quick","Fast and flawless. Red carpet ready."],["Braiding","Free consult","Protective styles with care and precision."]],
  "Contractor":       [["Home Remodeling","Free estimate","Full-scope renovations done right."],["Additions & Extensions","Free estimate","More space, built to code."],["Roofing","Free estimate","Replacement and repair. Licensed and insured."],["Flooring Installation","Free estimate","Hardwood, tile, LVP — we install it all."],["Kitchen Renovation","Free estimate","The remodel that transforms your whole home."],["Bathroom Remodel","Free estimate","Modern upgrades, professional finish."]],
};

const CAT_TRUST = {
  "Nail Salon":       ["Chip-Free Guarantee","Sanitized Tools Every Visit","Licensed Technicians","Walk-Ins Welcome"],
  "Barbershop":       ["Satisfaction Guaranteed","Walk-Ins Welcome","Licensed Barbers","Clean Tools Every Cut"],
  "Restaurant":       ["Fresh Ingredients Daily","Dine-In & Takeout","Family Recipes","4.5+ Star Rated"],
  "Pest Control":     ["If They Return, We Return Free","Pet-Safe Treatments","Licensed & Insured","Satisfaction Guaranteed"],
  "Pressure Washing": ["Before & After Photos Provided","Fully Insured","Eco-Friendly Solutions","Satisfaction Guaranteed"],
  "Painter":          ["Licensed & Insured","Free Color Consultation","Clean Jobsite Daily","Satisfaction Guaranteed"],
  "Hvac":             ["24/7 Emergency Service","Licensed & Insured","Parts & Labor Warranty","Same-Day Diagnostics"],
  "Auto Repair":      ["No Upselling. Ever.","Free Diagnostics","Parts & Labor Warranty","Honest Estimates Always"],
  "Landscaping":      ["Licensed & Insured","Free Estimates","On-Time Guaranteed","Pet & Kid Safe Products"],
  "Cleaning Service": ["Bonded & Insured","Eco-Friendly Products","Background-Checked Staff","Satisfaction Guaranteed"],
  "Hair Salon":       ["Licensed Stylists","Premium Products Only","Walk-Ins Welcome","Satisfaction Guaranteed"],
  "Contractor":       ["Licensed & Insured","Free Estimates","On-Time & On-Budget","Workmanship Warranty"],
  "default":          ["Licensed & Insured","Free Estimates","Satisfaction Guaranteed","Serving Augusta Area"],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Stars({ n = 5, color = "#f59e0b" }) {
  const r = Math.min(5, Math.max(0, Math.round(n)));
  return <span style={{ color, letterSpacing: 1 }}>{"★".repeat(r)}{"☆".repeat(5 - r)}</span>;
}

// ─── POBLANOS SPECIFIC DATA ───────────────────────────────────────────────────
const PIMG = {
  fajitas:   "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/016f3fa72_generated_image.png",
  burrito:   "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/e1e8443be_generated_image.png",
  tacos:     "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/2ddec5c0f_generated_image.png",
  margarita: "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/c56c84de0_generated_image.png",
  birria:    "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/5c21660ad_generated_image.png",
  nachos:    "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/4e47d5093_generated_image.png",
  acp:       "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/7f80be51c_generated_image.png",
  interior:  "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/d71d5ce4c_generated_image.png",
};

const PMENU = [
  { id:"fan-favorites", label:"⭐ Fan Favorites", items:[
    { name:"Cuco Special", price:"$18.95", desc:"Grilled chicken, steak & shrimp with onions, peppers, mushrooms on rice topped with queso. The legend.", badge:"🔥 Most Ordered", img:"acp" },
    { name:"Quesa Birria", price:"$10.95", desc:"Crispy cheese-sealed birria tacos with beef broth consomé for dipping. Life-changing.", badge:"💫 Must Try", img:"birria" },
    { name:"Poblano's Ultimate Nachos", price:"$16.95", desc:"Steak, chicken, pastor, shrimp, pineapple, cheese sauce & pico piled high.", badge:"🌶 Loaded", img:"nachos" },
    { name:"Street Tacos", price:"$11.95", desc:"3 tacos with cilantro, onions, avocado & lime. Steak, Birria, Chicken, Carnitas or Pastor.", badge:"🌿 Fresh", img:"tacos" },
  ]},
  { id:"fajitas", label:"🔥 Fajitas", items:[
    { name:"Fajitas Texanas", price:"$13.95", desc:"Steak, chicken & shrimp on a sizzling cast iron with peppers, rice, beans, guac & pico.", img:"fajitas" },
    { name:"Mix Fajitas", price:"$12.95", desc:"Pick any two proteins with all the traditional sides.", img:"fajitas" },
    { name:"Chicken Fajitas", price:"$11.95", desc:"Tender grilled chicken, caramelized onions & peppers with all the fixings.", img:"fajitas" },
    { name:"Steak Fajitas", price:"$12.95", desc:"Premium grilled steak with peppers and onions. A Texas classic done right.", img:"fajitas" },
  ]},
  { id:"signatures", label:"👑 Signatures", items:[
    { name:"ACP Supreme", price:"$17.95", desc:"Chicken strips, chorizo, onions, bell peppers & tomatoes on rice topped with queso & sour cream.", badge:"🏆 Fan Fave", img:"acp" },
    { name:"Pollo Cancun", price:"$18.95", desc:"Chicken & shrimp, sautéed broccoli, onions, zucchini & grilled pineapple over rice with queso.", img:"acp" },
    { name:"Burrito Chingon", price:"$17.95", desc:"Steak, chorizo, onions & beans topped with enchilada sauce, queso, more steak & avocado.", badge:"🔥 Bold", img:"burrito" },
    { name:"Carnitas De Puerco", price:"$17.95", desc:"Michoacán-style pork slow-cooked with orange rinds. Served with rice, beans & guacamole.", badge:"🇲🇽 Authentic", img:"tacos" },
  ]},
  { id:"nachos", label:"🧀 Nachos & Quesadillas", items:[
    { name:"Ultimate Nachos", price:"$16.95", desc:"Steak, chicken, pastor, shrimp, pineapple, cheese sauce & pico. The king of shareables.", badge:"🏆 Best Seller", img:"nachos" },
    { name:"O.M.G Nachos", price:"$16.95", desc:"Grilled chicken, chorizo, refried beans, cheese sauce, pico & sour cream.", img:"nachos" },
    { name:"Quesadilla Texana", price:"$18.95", desc:"Large quesadilla stuffed with steak, chicken & shrimp, topped with cheese sauce.", img:"nachos" },
    { name:"Bacon Chicken Ranch Quesadilla", price:"$15.95", desc:"Chicken, cheese, bacon & ranch with lettuce, sour cream & pico.", img:"nachos" },
  ]},
  { id:"seafood", label:"🦐 Mariscos", items:[
    { name:"Shrimp Poblano's", price:"$18.95", desc:"Poblano pepper stuffed with grilled shrimp, pepper, onion, corn & queso fresco.", badge:"✨ Chef's Pick", img:"fajitas" },
    { name:"Tropical Shrimp", price:"$18.95", desc:"Grilled shrimp, pineapple, zucchini & red onion with cheese sauce, guac & pico.", img:"fajitas" },
    { name:"Camarones Con Chipotle", price:"$18.95", desc:"Grilled shrimp, onions & peppers in bold chipotle sauce. Bring the heat.", badge:"🌶 Spicy", img:"fajitas" },
    { name:"Coctel De Camarón", price:"$17.95", desc:"Mexican-style shrimp cocktail with pico de gallo, avocado & lime.", img:"fajitas" },
  ]},
  { id:"drinks", label:"🍹 Bar", items:[
    { name:"Classic Margarita", price:"Ask server", desc:"Hand-shaken with fresh lime, premium tequila & triple sec. Rocks or frozen.", badge:"🧊 Signature", img:"margarita" },
    { name:"Mango Margarita", price:"Ask server", desc:"Sweet, tropical & irresistible. Fresh mango blended with tequila.", badge:"🥭 Fan Fave", img:"margarita" },
    { name:"Happy Hour Specials", price:"See staff", desc:"Ask about our rotating happy hour deals. Great drinks, even better prices.", img:"margarita" },
  ]},
];


// ─── GENERIC SITE (all other leads) ──────────────────────────────────────────
function GenericSite({ lead }) {
  const theme = THEMES[lead.category] || THEMES["default"];
  const emoji = CAT_EMOJI[lead.category] || "📍";
  const tagline = CAT_TAGLINES[lead.category] || CAT_TAGLINES["default"];
  const services = CAT_SERVICES[lead.category] || [["Professional Service","Free quote","Quality work you can trust."],["Free Consultation","$0","Contact us to get started."]];
  const trust = CAT_TRUST[lead.category] || CAT_TRUST["default"];
  const reviews = lead.google_reviews_full?.length ? lead.google_reviews_full : [{ text:`${lead.business_name} is the best in ${lead.city}! Highly recommend to anyone.`, author:"Verified Customer", rating:5 }];
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent((lead.address||"") || (lead.city+", GA"))}`;
  const [navSolid, setNavSolid] = useState(false);
  useEffect(()=>{ const fn=()=>setNavSolid(window.scrollY>60); window.addEventListener("scroll",fn); return ()=>window.removeEventListener("scroll",fn); },[]);

  return (
    <div style={{ background:theme.bg,minHeight:"100vh",color:"#e8e8f0",fontFamily:theme.font,overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Oswald:wght@400;600;700&family=Inter:wght@300;400;600;700;800&family=Lora:ital,wght@0,600;1,400&family=Merriweather:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .g-fade{animation:fadeUp 0.8s ease forwards}
        .g-svc:hover{border-color:${theme.accent}!important;transform:translateY(-3px)!important}
        .g-cta:hover{transform:scale(1.04)!important;opacity:0.92!important}
        @media(max-width:768px){
          .g-h1{font-size:44px!important}
          .g-svcs{grid-template-columns:1fr 1fr!important}
          .g-trust{grid-template-columns:1fr 1fr!important}
          .g-revs{grid-template-columns:1fr!important}
          .g-info{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,background:navSolid?`${theme.bg}f8`:"transparent",backdropFilter:navSolid?"blur(20px)":"none",borderBottom:navSolid?`1px solid ${theme.accent}22`:"none",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.3s" }}>
        <div style={{ fontSize:17,fontWeight:800,color:"#fff" }}>{emoji} {lead.business_name}</div>
        <a href={`tel:${lead.phone}`} className="g-cta" style={{ background:`linear-gradient(135deg,${theme.accent},${theme.accent}bb)`,color:"#000",fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:13,padding:"9px 20px",borderRadius:50,textDecoration:"none",transition:"all 0.2s" }}>
          📞 {lead.phone}
        </a>
      </nav>

      {/* HERO */}
      <div style={{ minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",background:`linear-gradient(135deg,rgba(0,0,0,0.4) 0%,${theme.bg} 100%)`,overflow:"hidden",padding:"100px 24px 60px" }}>
        <div style={{ position:"absolute",top:"-15%",right:"-8%",width:550,height:550,borderRadius:"50%",background:`radial-gradient(circle,${theme.accent}15 0%,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:"-20%",left:"-10%",width:450,height:450,borderRadius:"50%",background:`radial-gradient(circle,${theme.accent}0a 0%,transparent 70%)`,pointerEvents:"none" }}/>
        <div className="g-fade" style={{ textAlign:"center",maxWidth:800,position:"relative" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:`${theme.accent}18`,border:`1px solid ${theme.accent}40`,borderRadius:100,padding:"8px 22px",marginBottom:28,fontFamily:"'Inter',sans-serif" }}>
            <Stars n={Math.round(lead.google_rating||5)} color={theme.accent}/>
            <span style={{ fontSize:12,color:"rgba(255,255,255,0.65)",letterSpacing:1.5,textTransform:"uppercase" }}>{lead.google_rating||"5.0"} Stars · {lead.review_count||"verified"} Reviews · {lead.city}, GA</span>
          </div>
          <h1 className="g-h1" style={{ fontSize:66,fontWeight:900,color:"#fff",lineHeight:1.08,marginBottom:22,textShadow:"0 4px 40px rgba(0,0,0,0.6)" }}>{lead.business_name}</h1>
          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:18,color:"rgba(255,255,255,0.55)",marginBottom:14 }}>{tagline}</p>
          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:14,color:"rgba(255,255,255,0.32)",marginBottom:44 }}>📍 Serving {lead.city} & the Augusta area</p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <a href={`tel:${lead.phone}`} className="g-cta" style={{ background:`linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,color:"#000",fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:15,padding:"16px 36px",borderRadius:50,textDecoration:"none",transition:"all 0.2s",boxShadow:`0 8px 32px ${theme.accent}44` }}>📞 Call Now — {lead.phone}</a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="g-cta" style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",color:"#fff",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,padding:"16px 28px",borderRadius:50,textDecoration:"none",transition:"all 0.2s" }}>📍 Get Directions</a>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{ background:`${theme.accent}0e`,borderTop:`1px solid ${theme.accent}20`,borderBottom:`1px solid ${theme.accent}20`,padding:"22px 40px" }}>
        <div className="g-trust" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:900,margin:"0 auto",gap:16,textAlign:"center" }}>
          {trust.map(t=>(<div key={t} style={{ fontFamily:"'Inter',sans-serif",fontSize:12,color:theme.accent,fontWeight:700 }}>✓ {t}</div>))}
        </div>
      </div>

      {/* ABOUT */}
      <div style={{ padding:"80px 24px",background:theme.bg }}>
        <div style={{ maxWidth:780,margin:"0 auto",textAlign:"center" }}>
          <div style={{ fontFamily:"'Inter',sans-serif",fontSize:10,color:theme.accent,letterSpacing:5,textTransform:"uppercase",marginBottom:12 }}>About Us</div>
          <h2 style={{ fontSize:40,fontWeight:900,color:"#fff",marginBottom:22,lineHeight:1.1 }}>{lead.city}'s Trusted <span style={{ color:theme.accent }}>{lead.category}</span></h2>
          <p style={{ fontFamily:"'Inter',sans-serif",fontSize:16,color:"rgba(255,255,255,0.52)",lineHeight:1.9 }}>
            At {lead.business_name}, we've built our reputation on delivering exceptional results for every single client.
            Located in {lead.city}, Georgia, we serve the entire Augusta area with the quality and professionalism you deserve.
            With {lead.review_count||"dozens of"} verified 5-star reviews, our work speaks for itself.
          </p>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ padding:"0 24px 80px",background:theme.bg }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <div style={{ fontFamily:"'Inter',sans-serif",fontSize:10,color:theme.accent,letterSpacing:5,textTransform:"uppercase",marginBottom:12 }}>What We Offer</div>
            <h2 style={{ fontSize:40,fontWeight:900,color:"#fff" }}>Our Services</h2>
          </div>
          <div className="g-svcs" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14 }}>
            {services.map(([name,price,desc],i)=>(
              <div key={i} className="g-svc" style={{ background:`${theme.accent}08`,border:`1px solid ${theme.border}`,borderRadius:14,padding:"22px 18px",transition:"all 0.22s" }}>
                <div style={{ fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,color:"#fff",marginBottom:4 }}>{name}</div>
                <div style={{ fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:theme.accent,marginBottom:8 }}>{price}</div>
                <div style={{ fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.42)",lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:36 }}>
            <a href={`tel:${lead.phone}`} className="g-cta" style={{ display:"inline-block",background:`linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,color:"#000",fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:14,padding:"14px 38px",borderRadius:50,textDecoration:"none",transition:"all 0.2s" }}>📞 Get a Free Quote</a>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      {reviews.length>0&&(
        <div style={{ background:"rgba(255,255,255,0.015)",padding:"80px 24px",borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth:1000,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:40 }}>
              <div style={{ fontFamily:"'Inter',sans-serif",fontSize:10,color:theme.accent,letterSpacing:5,textTransform:"uppercase",marginBottom:12 }}>Verified Reviews</div>
              <h2 style={{ fontSize:40,fontWeight:900,color:"#fff" }}>What Clients Say</h2>
              <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:12,fontFamily:"'Inter',sans-serif" }}>
                <Stars n={Math.round(lead.google_rating||5)} color={theme.accent}/>
                <span style={{ color:"rgba(255,255,255,0.4)",fontSize:13 }}>{lead.google_rating||"5.0"} avg · {lead.review_count||"verified"} Google reviews</span>
              </div>
            </div>
            <div className="g-revs" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18 }}>
              {reviews.map((r,i)=>(
                <div key={i} style={{ background:`${theme.accent}06`,border:`1px solid ${theme.accent}22`,borderRadius:18,padding:"26px",position:"relative" }}>
                  <div style={{ position:"absolute",top:16,right:20,fontSize:42,color:`${theme.accent}12`,fontFamily:"Georgia,serif" }}>"</div>
                  <Stars n={r.rating||5} color={theme.accent}/>
                  <p style={{ fontFamily:"'Inter',sans-serif",fontSize:14,color:"rgba(255,255,255,0.62)",lineHeight:1.85,margin:"12px 0 16px",fontStyle:"italic" }}>"{r.text}"</p>
                  <div style={{ fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:theme.accent }}>— {r.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT & WHY US */}
      <div style={{ padding:"80px 24px",background:theme.bg }}>
        <div style={{ maxWidth:960,margin:"0 auto" }}>
          <div className="g-info" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:26 }}>
            <div style={{ background:`${theme.accent}06`,border:`1px solid ${theme.accent}20`,borderRadius:20,padding:"34px 30px" }}>
              <div style={{ fontFamily:"'Inter',sans-serif",fontSize:10,color:theme.accent,letterSpacing:4,textTransform:"uppercase",marginBottom:14 }}>Contact Us</div>
              <h3 style={{ fontSize:28,fontWeight:900,color:"#fff",marginBottom:24 }}>Ready to Get Started?</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                <a href={`tel:${lead.phone}`} style={{ display:"flex",alignItems:"center",gap:12,background:`linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,color:"#000",fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:15,padding:"15px 20px",borderRadius:12,textDecoration:"none" }}>📞 {lead.phone}</a>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.65)",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,padding:"13px 20px",borderRadius:12,textDecoration:"none" }}>📍 {lead.address||lead.city+", GA"}</a>
              </div>
            </div>
            <div style={{ background:`${theme.accent}06`,border:`1px solid ${theme.accent}20`,borderRadius:20,padding:"34px 30px" }}>
              <div style={{ fontFamily:"'Inter',sans-serif",fontSize:10,color:theme.accent,letterSpacing:4,textTransform:"uppercase",marginBottom:14 }}>Why Choose Us</div>
              <h3 style={{ fontSize:28,fontWeight:900,color:"#fff",marginBottom:22 }}>Our Promise</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {trust.map((t,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontFamily:"'Inter',sans-serif",fontSize:14,color:"rgba(255,255,255,0.68)" }}><span style={{ color:theme.accent,fontWeight:800 }}>✓</span>{t}</div>))}
                <div style={{ marginTop:10,paddingTop:14,borderTop:`1px solid rgba(255,255,255,0.05)`,display:"flex",alignItems:"center",gap:8 }}>
                  <Stars n={Math.round(lead.google_rating||5)} color={theme.accent}/>
                  <span style={{ fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)" }}>{lead.google_rating||"5.0"} · {lead.review_count||"★★★★★"} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background:"#050505",borderTop:`1px solid ${theme.accent}15`,padding:"40px 24px 24px",textAlign:"center" }}>
        <div style={{ fontSize:24,fontWeight:900,color:"#fff",marginBottom:8 }}>{emoji} {lead.business_name}</div>
        <div style={{ fontFamily:"'Inter',sans-serif",fontSize:13,color:"rgba(255,255,255,0.28)",marginBottom:22 }}>{lead.city}, GA · {lead.phone}</div>
        <a href={`tel:${lead.phone}`} className="g-cta" style={{ display:"inline-block",background:`linear-gradient(135deg,${theme.accent},${theme.accent}cc)`,color:"#000",fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:14,padding:"14px 36px",borderRadius:50,textDecoration:"none",transition:"all 0.2s" }}>📞 Call Now — {lead.phone}</a>
        <div style={{ fontFamily:"'Inter',sans-serif",fontSize:11,color:"rgba(255,255,255,0.1)",marginTop:28,letterSpacing:1 }}>© 2025 {lead.business_name} · {lead.address||lead.city+", GA"}</div>
      </div>
    </div>
  );
}



// Real Elegant Nails photos from Google Maps / official listing
const EN_PHOTOS = [
  "https://lh3.googleusercontent.com/p/AF1QipNb6JVlljKqNyjNAIWmvQFqfTPjJovLm0FGKQLV=s1600",
  "https://lh3.googleusercontent.com/p/AF1QipMUfTkagCbxz1oGwDNuoJfG6bXQIh0O9wV2SBHV=s1600",
  "https://lh3.googleusercontent.com/p/AF1QipP9eRBi0jb2AkZ0U8oQgXqd3TlmG6H_NjlZi1Xm=s1600",
  "https://lh3.googleusercontent.com/p/AF1QipOeSK0Bl5EVJrqg6QWHIO-LYPKU4nk2U1mmRovV=s1600",
  "https://lh3.googleusercontent.com/p/AF1QipMq5TK6FZOr2rK_LBk-SKD5KXD7tCJNq0HnaxJD=s1600",
  "https://lh3.googleusercontent.com/p/AF1QipNpYmpKO-ADlKNIPBmHJZ8bSDKSnUX9LT5jWm1W=s1600",
];

const LOGO = "https://media.base44.com/images/public/69dfd6feb7b16c0576242c01/logo_circle.png";

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



// ─── MAIN DISPATCHER — reads slug → fetches from backend → renders correct site ─
export default function BusinessSite() {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slug = getSlug();

  useEffect(() => {
    if (!slug) { setError("No business slug in URL."); setLoading(false); return; }

    // Always fetch from backend function — never uses client-side auth
    fetch(`${FUNCTIONS_URL}/getLeadBySlug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const slug = data.lead?.demo_site_slug;
        if (slug === "ElegantNailsAndSpa")      { window.location.href = "/ElegantNailsSite"; return; }
        if (slug === "PoblanosMexicanBarGrill")  { window.location.href = "/PoblanosSite"; return; }
        setLead(data.lead);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ background:"#0a0a10",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16 }}>
      <div style={{ fontSize:40 }}>⚡</div>
      <div style={{ color:"rgba(255,255,255,0.4)",fontFamily:"'Inter',sans-serif",fontSize:14,letterSpacing:2 }}>Loading...</div>
    </div>
  );

  if (error||!lead) return (
    <div style={{ background:"#0a0a10",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:40 }}>
      <div style={{ fontSize:40 }}>😕</div>
      <div style={{ color:"rgba(255,255,255,0.5)",fontFamily:"'Inter',sans-serif",fontSize:15,textAlign:"center" }}>{error||"Business not found"}</div>
    </div>
  );

  // Route by slug — each gets its exact custom site
  // All others → smart generic site with their own data
  return <GenericSite lead={lead} />;
}
