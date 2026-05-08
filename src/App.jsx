import { useState } from "react";

// Corrected per Avaya diagram J.Neuhaus 12 Jan 2008
// DCP 4-wire (8400-series): pins 1,2,3,5 — NOT 3,4,5,6
// Pin 1: W/Or = TXT (T1)  Pin 2: Or/W = TXR (R1)
// Pin 3: W/Gn = PXT (T2)  Pin 5: W/Bu = PXR (R2)
// Pin 4 (Bu/W) = NOT USED for DCP  Pin 6 = speakerphone power only

const PIN_DATA = [
  { pin:1, color:"#FFFFFF", stripe:"#E65100", label:"W/Or", pair:"Pair 2 (Orange)", definity:"T1/TXT", used:true  },
  { pin:2, color:"#E65100", stripe:null,      label:"Or/W", pair:"Pair 2 (Orange)", definity:"R1/TXR", used:true  },
  { pin:3, color:"#FFFFFF", stripe:"#1B5E20", label:"W/Gn", pair:"Pair 3 (Green)",  definity:"T2/PXT", used:true  },
  { pin:4, color:"#1565C0", stripe:null,      label:"Bu/W", pair:"Pair 1 (Blue)",   definity:"—",      used:false },
  { pin:5, color:"#FFFFFF", stripe:"#1565C0", label:"W/Bu", pair:"Pair 1 (Blue)",   definity:"R2/PXR", used:true  },
  { pin:6, color:"#1B5E20", stripe:null,      label:"Gn/W", pair:"Pair 3 (Green)",  definity:"SPKR PWR",used:false },
  { pin:7, color:"#FFFFFF", stripe:"#4E342E", label:"W/Br", pair:"Pair 4 (Brown)",  definity:"—",      used:false },
  { pin:8, color:"#4E342E", stripe:null,      label:"Br/W", pair:"Pair 4 (Brown)",  definity:"—",      used:false },
];

const PAIR_25 = [
  { pair:1,  tip:"W/BL",  ring:"BL/W",  tipHex:"#1E3A5F", tipStripe:"#1565C0", ringHex:"#1565C0"  },
  { pair:2,  tip:"W/O",   ring:"O/W",   tipHex:"#2C1810", tipStripe:"#E65100", ringHex:"#E65100"  },
  { pair:3,  tip:"W/G",   ring:"G/W",   tipHex:"#1A2E1A", tipStripe:"#1B5E20", ringHex:"#1B5E20"  },
  { pair:4,  tip:"W/BR",  ring:"BR/W",  tipHex:"#2A1F1A", tipStripe:"#4E342E", ringHex:"#4E342E"  },
  { pair:5,  tip:"W/S",   ring:"S/W",   tipHex:"#2A2A2A", tipStripe:"#9E9E9E", ringHex:"#757575"  },
  { pair:6,  tip:"R/BL",  ring:"BL/R",  tipHex:"#7B1A1A", tipStripe:"#1565C0", ringHex:"#1565C0"  },
  { pair:7,  tip:"R/O",   ring:"O/R",   tipHex:"#7B1A1A", tipStripe:"#E65100", ringHex:"#E65100"  },
  { pair:8,  tip:"R/G",   ring:"G/R",   tipHex:"#7B1A1A", tipStripe:"#1B5E20", ringHex:"#1B5E20"  },
  { pair:9,  tip:"R/BR",  ring:"BR/R",  tipHex:"#7B1A1A", tipStripe:"#4E342E", ringHex:"#4E342E"  },
  { pair:10, tip:"R/S",   ring:"S/R",   tipHex:"#7B1A1A", tipStripe:"#9E9E9E", ringHex:"#757575"  },
  { pair:11, tip:"BK/BL", ring:"BL/BK", tipHex:"#1A1A1A", tipStripe:"#1565C0", ringHex:"#1565C0"  },
  { pair:12, tip:"BK/O",  ring:"O/BK",  tipHex:"#1A1A1A", tipStripe:"#E65100", ringHex:"#E65100"  },
  { pair:13, tip:"BK/G",  ring:"G/BK",  tipHex:"#1A1A1A", tipStripe:"#1B5E20", ringHex:"#1B5E20"  },
  { pair:14, tip:"BK/BR", ring:"BR/BK", tipHex:"#1A1A1A", tipStripe:"#4E342E", ringHex:"#4E342E"  },
  { pair:15, tip:"BK/S",  ring:"S/BK",  tipHex:"#1A1A1A", tipStripe:"#9E9E9E", ringHex:"#757575"  },
  { pair:16, tip:"Y/BL",  ring:"BL/Y",  tipHex:"#3D3000", tipStripe:"#1565C0", ringHex:"#1565C0"  },
  { pair:17, tip:"Y/O",   ring:"O/Y",   tipHex:"#3D3000", tipStripe:"#E65100", ringHex:"#E65100"  },
  { pair:18, tip:"Y/G",   ring:"G/Y",   tipHex:"#3D3000", tipStripe:"#1B5E20", ringHex:"#1B5E20"  },
  { pair:19, tip:"Y/BR",  ring:"BR/Y",  tipHex:"#3D3000", tipStripe:"#4E342E", ringHex:"#4E342E"  },
  { pair:20, tip:"Y/S",   ring:"S/Y",   tipHex:"#3D3000", tipStripe:"#9E9E9E", ringHex:"#757575"  },
  { pair:21, tip:"V/BL",  ring:"BL/V",  tipHex:"#2D1B47", tipStripe:"#1565C0", ringHex:"#1565C0"  },
  { pair:22, tip:"V/O",   ring:"O/V",   tipHex:"#2D1B47", tipStripe:"#E65100", ringHex:"#E65100"  },
  { pair:23, tip:"V/G",   ring:"G/V",   tipHex:"#2D1B47", tipStripe:"#1B5E20", ringHex:"#1B5E20"  },
  { pair:24, tip:"V/BR",  ring:"BR/V",  tipHex:"#2D1B47", tipStripe:"#4E342E", ringHex:"#4E342E"  },
  { pair:25, tip:"V/S",   ring:"S/V",   tipHex:"#2D1B47", tipStripe:"#9E9E9E", ringHex:"#757575"  },
];

// DCP 4-wire: station cable orange pair = T1/R1, green-tip + blue-tip = T2/R2
// 1-pair DCP and analog: blue pair, pins 4 & 5
// BRI S/T (TN556C): pins 3,4,5,6 — 12 circuits per card, NO pair skipping
// Source: Tek-Tips community — verify against official Avaya TN556C documentation
const PORT_TYPES = [
  {
    id:"dcp2", label:"2-Pair DCP",
    color:"#0D47A1", lightColor:"#E3F2FD", borderColor:"#1565C0",
    pins:[1,2,3,5], pairsUsed:2,
    pairs:["Orange pair (Pair 2) — pins 1 & 2","Green tip + Blue tip — pins 3 & 5"],
    signals:[
      "Pin 1 W/Or = T1 (TXT — terminal transmit tip)",
      "Pin 2 Or/W = R1 (TXR — terminal transmit ring)",
      "Pin 3 W/Gn = T2 (PXT — PBX transmit tip)",
      "Pin 5 W/Bu = R2 (PXR — PBX transmit ring)",
    ],
    note:"Pins 4 & 6 NOT punched. Pin 4 (Bu/W) unused. Pin 6 (Gn/W) = speakerphone power only.",
    conductors:[
      {label:"T1/TXT", wire:"W/Or", jackPin:1, role:"tip",  pair:"Orange"},
      {label:"R1/TXR", wire:"Or/W", jackPin:2, role:"ring", pair:"Orange"},
      {label:"T2/PXT", wire:"W/Gn", jackPin:3, role:"tip",  pair:"Green-tip"},
      {label:"R2/PXR", wire:"W/Bu", jackPin:5, role:"ring", pair:"Blue-tip"},
    ],
    ampPairs:[2,2,3,1], // approximate 25-pair side: pair2=orange(T1/R1), then varies
    rowLabels:["N","N+1","N+2","N+3"],
  },
  {
    id:"dcp1", label:"1-Pair DCP",
    color:"#4A148C", lightColor:"#F3E5F5", borderColor:"#6A1B9A",
    pins:[4,5], pairsUsed:1,
    pairs:["Blue pair (Pair 1) — pins 4 & 5"],
    signals:[
      "Pin 5 W/Bu = T1",
      "Pin 4 Bu/W = R1",
    ],
    note:"Blue pair only — pins 4 and 5. Verify with your specific station type.",
    conductors:[
      {label:"T1", wire:"W/Bu", jackPin:5, role:"tip",  pair:"Blue"},
      {label:"R1", wire:"Bu/W", jackPin:4, role:"ring", pair:"Blue"},
    ],
    rowLabels:["N","N+1"],
  },
  {
    id:"analog", label:"Analog",
    color:"#BF360C", lightColor:"#FBE9E7", borderColor:"#D84315",
    pins:[4,5], pairsUsed:1,
    pairs:["Blue pair (Pair 1) — pins 4 & 5"],
    signals:[
      "Pin 5 W/Bu = Tip",
      "Pin 4 Bu/W = Ring",
    ],
    note:"Blue pair only — same physical pinout as 1-pair DCP at the jack.",
    conductors:[
      {label:"T",  wire:"W/Bu", jackPin:5, role:"tip",  pair:"Blue"},
      {label:"R",  wire:"Bu/W", jackPin:4, role:"ring", pair:"Blue"},
    ],
    rowLabels:["N","N+1"],
  },
  {
    id:"bri", label:"BRI S/T",
    color:"#00695C", lightColor:"#E0F7FA", borderColor:"#00897B",
    pins:[3,4,5,6], pairsUsed:2,
    pairs:[
      "Blue pair (25pr W-BL/BL-W) — pins 4 & 5 = PXT/PXR (PBX transmit)",
      "Green pair translated (25pr W-O/O-W) — pins 3 & 6 = TXT/TXR (Terminal transmit)",
    ],
    signals:[
      "Pin 5 W/Bu = PXR (PBX transmit Ring) ← Amphenol W-BL pair 1 tip",
      "Pin 4 Bu/W = PXT (PBX transmit Tip) ← Amphenol BL-W pair 1 ring",
      "Pin 3 W/Gn = TXT (Terminal transmit Tip) ← Amphenol W-O pair 2 tip",
      "Pin 6 Gn/W = TXR (Terminal transmit Ring) ← Amphenol O-W pair 2 ring",
    ],
    note:"TN556C/D — 12 circuits/card · NO pair skipping · Max 1900ft @ 24AWG · ⚠ 100Ω terminating resistor required (440A4 or 110RA1-12). Source: Avaya 555-245-773 Issue 4.1 Jun 2005 (TN556D — C variant assumed equivalent). Signal labels corrected from community source.",
    conductors:[
      {label:"PXR", wire:"W/Bu", jackPin:5, role:"tip",  pair:"Blue (25pr: W-BL)"},
      {label:"PXT", wire:"Bu/W", jackPin:4, role:"ring", pair:"Blue (25pr: BL-W)"},
      {label:"TXT", wire:"W/Gn", jackPin:3, role:"tip",  pair:"Green (25pr: W-O)"},
      {label:"TXR", wire:"Gn/W", jackPin:6, role:"ring", pair:"Green (25pr: O-W)"},
    ],
    rowLabels:["N","N+1","N+2","N+3"],
    maxPorts:12,
    noSkip:true,
  },
  {
    id:"hybrid", label:"Hybrid (MET)",
    color:"#E65100", lightColor:"#FFF3E0", borderColor:"#FF8A65",
    pins:[3,4,5], pairsUsed:2,
    pairs:[
      "Blue pair (Pair 1) — pins 4 & 5 (T/R voice)",
      "White/Green conductor — pin 3 (A-lead MET signaling)",
    ],
    signals:[
      "Pin 5 W/Bu = Tip (voice)",
      "Pin 4 Bu/W = Ring (voice)",
      "Pin 3 W/Gn = A-lead (MET digital signaling)",
    ],
    note:"TN762 8-port hybrid. MET sets need all 3 pins. Standard analog sets: pins 4 & 5 only. A-lead is single conductor — Gn/W (pin 6) is NOT connected. Verify A-lead polarity vs TN762 documentation.",
    conductors:[
      {label:"T",      wire:"W/Bu", jackPin:5, role:"tip",  pair:"Blue"},
      {label:"R",      wire:"Bu/W", jackPin:4, role:"ring", pair:"Blue"},
      {label:"A-lead", wire:"W/Gn", jackPin:3, role:"tip",  pair:"Green-tip only"},
    ],
    rowLabels:["N","N+1","N+2"],
    maxPorts:8,
    noSkip:false,
  },
];

// ── MDF pair map data (source: Avaya official cross-connect diagram KLC 063097) ──
// 25 entries per card = 25 Amphenol pairs. null=unused.
// sig types: "TR"=T/R voice, "TX"=terminal-tx, "PX"=PBX-tx, "A"=A-lead, "GND"=ground
const mk = (type, port) => ({type, port});
const CARD_MAPS = [
  { tn:"TN735", name:"4 Port MET Line",    ports:4,  color:"#1565C0",
    desc:"3 wires/port (T/R + A-lead). Pairs group as T/R pair + A-lead conductor per port.",
    pairs:[mk("TR",1),mk("A",1),null,mk("TR",2),mk("A",2),null,
           mk("TR",3),mk("A",3),null,mk("TR",4),mk("A",4),null,
           null,null,null,null,null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN760", name:"4 Port Tie Trunk",   ports:4,  color:"#4527A0",
    desc:"2 pairs/port (T/R each direction). 8 pairs total.",
    pairs:[mk("TR",1),mk("TR",1),null,mk("TR",2),mk("TR",2),null,
           mk("TR",3),mk("TR",3),null,mk("TR",4),mk("TR",4),null,
           null,null,null,null,null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN742", name:"8 Port Analog",      ports:8,  color:"#BF360C",
    desc:"1 pair/port (T/R). 8 sequential pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN747", name:"8 Port CO Trunk",    ports:8,  color:"#880E4F",
    desc:"1 pair/port (T/R). 8 sequential pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN726", name:"8 Port Data Line",   ports:8,  color:"#37474F",
    desc:"2 pairs/port (TX + PX). 16 pairs.",
    pairs:[mk("TX",1),mk("PX",1),mk("TX",2),mk("PX",2),mk("TX",3),mk("PX",3),mk("TX",4),mk("PX",4),
           mk("TX",5),mk("PX",5),mk("TX",6),mk("PX",6),mk("TX",7),mk("PX",7),mk("TX",8),mk("PX",8),
           null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN753", name:"8 Port DID",         ports:8,  color:"#1A237E",
    desc:"1 pair/port (T/R). 8 sequential pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN754", name:"8 Port 4-Wire Digital", ports:8, color:"#0D47A1",
    desc:"2 pairs/port (TXT/TXR + PXT/PXR). 16 pairs.",
    pairs:[mk("TX",1),mk("PX",1),mk("TX",2),mk("PX",2),mk("TX",3),mk("PX",3),mk("TX",4),mk("PX",4),
           mk("TX",5),mk("PX",5),mk("TX",6),mk("PX",6),mk("TX",7),mk("PX",7),mk("TX",8),mk("PX",8),
           null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN556", name:"12 Port BRI S/T",    ports:12, color:"#00695C",
    desc:"2 pairs/port (TXT/TXR + PXT/PXR). 24 pairs, GND at 25. NO pair skipping.",
    pairs:[mk("TX",1),mk("PX",1),mk("TX",2),mk("PX",2),mk("TX",3),mk("PX",3),
           mk("TX",4),mk("PX",4),mk("TX",5),mk("PX",5),mk("TX",6),mk("PX",6),
           mk("TX",7),mk("PX",7),mk("TX",8),mk("PX",8),mk("TX",9),mk("PX",9),
           mk("TX",10),mk("PX",10),mk("TX",11),mk("PX",11),mk("TX",12),mk("PX",12),
           mk("GND",0)] },
  { tn:"TN746", name:"16 Port Analog",     ports:16, color:"#BF360C",
    desc:"1 pair/port (T/R). 16 sequential pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           mk("TR",9),mk("TR",10),mk("TR",11),mk("TR",12),mk("TR",13),mk("TR",14),mk("TR",15),mk("TR",16),
           null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN2181",name:"16 Port 2-Wire Digital",ports:16,color:"#0D47A1",
    desc:"1 pair/port (T/R digital). 16 sequential pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           mk("TR",9),mk("TR",10),mk("TR",11),mk("TR",12),mk("TR",13),mk("TR",14),mk("TR",15),mk("TR",16),
           null,null,null,null,null,null,null,null,mk("GND",0)] },
  { tn:"TN793", name:"24 Port Analog",     ports:24, color:"#BF360C",
    desc:"1 pair/port (T/R). 24 sequential pairs + GND. Full Amphenol utilization.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),
           mk("TR",7),mk("TR",8),mk("TR",9),mk("TR",10),mk("TR",11),mk("TR",12),
           mk("TR",13),mk("TR",14),mk("TR",15),mk("TR",16),mk("TR",17),mk("TR",18),
           mk("TR",19),mk("TR",20),mk("TR",21),mk("TR",22),mk("TR",23),mk("TR",24),
           mk("GND",0)] },
  { tn:"TN2224",name:"24 Port 2-Wire Digital",ports:24,color:"#0D47A1",
    desc:"1 pair/port (T/R digital). 24 sequential pairs + GND. Full Amphenol utilization.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),
           mk("TR",7),mk("TR",8),mk("TR",9),mk("TR",10),mk("TR",11),mk("TR",12),
           mk("TR",13),mk("TR",14),mk("TR",15),mk("TR",16),mk("TR",17),mk("TR",18),
           mk("TR",19),mk("TR",20),mk("TR",21),mk("TR",22),mk("TR",23),mk("TR",24),
           mk("GND",0)] },
  { tn:"TN2182",name:"16 Port Analog (newer)",ports:16,color:"#BF360C",
    desc:"1 pair/port (T/R). Same pattern as TN746. 16 pairs.",
    pairs:[mk("TR",1),mk("TR",2),mk("TR",3),mk("TR",4),mk("TR",5),mk("TR",6),mk("TR",7),mk("TR",8),
           mk("TR",9),mk("TR",10),mk("TR",11),mk("TR",12),mk("TR",13),mk("TR",14),mk("TR",15),mk("TR",16),
           null,null,null,null,null,null,null,null,mk("GND",0)] },
];

const SIG_STYLES = {
  TR:  { bg:"#7B1A1A", border:"#EF9A9A", label:"T/R",  desc:"Tip/Ring voice" },
  TX:  { bg:"#0D47A1", border:"#90CAF9", label:"TX",   desc:"Terminal transmit" },
  PX:  { bg:"#1B5E20", border:"#A5D6A7", label:"PX",   desc:"PBX transmit" },
  A:   { bg:"#E65100", border:"#FFCC80", label:"A",    desc:"A-lead / signaling" },
  GND: { bg:"#263238", border:"#78909C", label:"GND",  desc:"Ground" },
};

// ── helpers ───────────────────────────────────────────────────────
function WireStripe({color,stripe,size=24}) {
  return (
    <div style={{width:size,height:size,borderRadius:3,background:color,
      border:"1.5px solid rgba(255,255,255,0.12)",flexShrink:0,
      position:"relative",overflow:"hidden"}}>
      {stripe&&[0,1,2,3,4].map(i=>(
        <div key={i} style={{position:"absolute",width:3,height:"200%",
          background:stripe,left:i*7-4,top:-4,
          transform:"rotate(-35deg)",opacity:0.85}}/>
      ))}
    </div>
  );
}
function SHdr({title}) {
  return <div style={{background:"#0A131C",padding:"9px 18px",
    borderBottom:"1px solid #1E2A35",fontFamily:"'Barlow Condensed',sans-serif",
    fontSize:13,fontWeight:700,color:"#78909C",letterSpacing:2}}>{title}</div>;
}
function InfoCard({label,body,accent="#FFD54F"}) {
  return (
    <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:5,padding:"10px 12px"}}>
      <div style={{fontSize:9,color:accent,letterSpacing:1.5,marginBottom:4}}>{label}</div>
      <div style={{fontSize:10,color:"#78909C",lineHeight:1.7}}>{body}</div>
    </div>
  );
}

// ── Jack diagram ──────────────────────────────────────────────────
function JackDiagram({at}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{fontSize:9,color:"#546E7A",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>RJ45 — REAR VIEW — T568B</div>
      <div style={{background:"#1A1A2E",border:"3px solid #37474F",borderRadius:8,
        padding:"14px 10px 12px",position:"relative",width:220}}>
        <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",
          width:36,height:11,background:"#263238",border:"2px solid #37474F",
          borderBottom:"none",borderRadius:"4px 4px 0 0"}}/>
        {/* pin numbers */}
        <div style={{display:"flex",gap:3,marginBottom:5,justifyContent:"center"}}>
          {PIN_DATA.map(p=>(
            <div key={p.pin} style={{width:21,textAlign:"center",fontSize:8,
              fontFamily:"'Share Tech Mono',monospace",
              color:at.pins.includes(p.pin)?"#FFD54F":"#455A64",
              fontWeight:at.pins.includes(p.pin)?"bold":"normal"}}>{p.pin}</div>
          ))}
        </div>
        {/* pin columns */}
        <div style={{display:"flex",gap:3,justifyContent:"center"}}>
          {PIN_DATA.map(p=>{
            const active=at.pins.includes(p.pin);
            return (
              <div key={p.pin} style={{width:21,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:13,height:30,
                  background:active?at.color:(p.used?"#37474F":"#1E2A35"),
                  border:active?`2px solid ${at.lightColor}`:"2px solid #37474F",
                  borderRadius:3,
                  boxShadow:active?`0 0 7px ${at.color}88`:"none",
                  transition:"all 0.3s"}}/>
                <div style={{fontSize:6,fontFamily:"'Share Tech Mono',monospace",
                  color:active?at.lightColor:"#37474F",
                  fontWeight:active?"bold":"normal",textAlign:"center",lineHeight:1.1}}>
                  {p.definity==="SPKR PWR"?"PWR":p.definity||"—"}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:8,background:"linear-gradient(90deg,#5D4037,#FFD54F,#5D4037)",
          height:3,borderRadius:2,opacity:0.5}}/>
      </div>
      <div style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",
        color:"#455A64",textAlign:"center",lineHeight:1.6}}>
        Pin 1 = left · latch faces away
      </div>
      {/* Warning banner for DCP4 */}
      {at.id==="dcp2" && (
        <div style={{background:"#7B1A1A33",border:"1px solid #EF535388",borderRadius:4,
          padding:"6px 10px",fontSize:9,color:"#EF9A9A",fontFamily:"'Share Tech Mono',monospace",
          textAlign:"center",maxWidth:210,lineHeight:1.6}}>
          ⚠ Pin 4 (Bu/W) NOT punched<br/>
          Not the same as Ethernet T568B!
        </div>
      )}
    </div>
  );
}

// ── 110 diagram ───────────────────────────────────────────────────
function Block110({at,startPort}) {
  const offset=(startPort-1)*at.pairsUsed;
  // For dcp2 we show 4 rows (but pairsUsed=2 on the 25-pair side)
  const showCount = Math.max(at.pairsUsed+2, 4);
  const rows = PAIR_25.slice(offset, offset+showCount);

  // Which 25-pair pair numbers carry which conductor
  // DCP2: pair offset+1 = T1/R1 (orange pair on station cable maps to amphenol pair)
  //        pair offset+2 = T2/R2
  const usedPairNums = Array.from({length:at.pairsUsed},(_,i)=>offset+i+1);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
        <div style={{fontSize:9,color:"#546E7A",fontFamily:"'Share Tech Mono',monospace",width:72,textAlign:"right"}}>CABLE SIDE</div>
        <div style={{flex:1,borderTop:"1px dashed #263238"}}/>
        <div style={{fontSize:9,color:"#37474F",fontFamily:"'Share Tech Mono',monospace"}}>← Amphenol</div>
      </div>
      {rows.map((p,i)=>{
        const pairNum=offset+i+1;
        const isUsed=usedPairNums.includes(pairNum);
        const condIdx=usedPairNums.indexOf(pairNum);
        const tipCond  = isUsed ? at.conductors.filter(c=>c.role==="tip")[condIdx]  : null;
        const ringCond = isUsed ? at.conductors.filter(c=>c.role==="ring")[condIdx] : null;
        return (
          <div key={pairNum} style={{display:"flex",gap:5,alignItems:"stretch",opacity:isUsed?1:0.28}}>
            <div style={{width:26,display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Share Tech Mono',monospace",fontSize:9,
              color:isUsed?at.lightColor:"#37474F",fontWeight:isUsed?"bold":"normal"}}>P{pairNum}</div>
            {/* Tip cell */}
            <div style={{flex:1,background:isUsed?`${at.color}22`:"#0A0E1A",
              border:`1px solid ${isUsed?at.borderColor:"#1E2A35"}`,
              borderRadius:4,padding:"4px 8px",display:"flex",alignItems:"center",gap:5}}>
              <WireStripe color={p.tipHex} stripe={p.tipStripe} size={16}/>
              <span style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",color:isUsed?at.lightColor:"#37474F"}}>{p.tip}</span>
              {tipCond&&<span style={{marginLeft:"auto",fontSize:9,color:"#FFD54F",fontWeight:"bold"}}>{tipCond.label}</span>}
            </div>
            {/* Clip */}
            <div style={{width:24,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:16,height:"100%",minHeight:26,
                background:isUsed?at.color:"#1A2330",
                border:`1px solid ${isUsed?at.borderColor:"#263238"}`,
                borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:isUsed?`0 0 5px ${at.color}55`:"none"}}>
                <div style={{fontSize:5,color:isUsed?at.lightColor:"#37474F",
                  fontFamily:"'Share Tech Mono',monospace",transform:"rotate(-90deg)",
                  whiteSpace:"nowrap",letterSpacing:1}}>CLIP</div>
              </div>
            </div>
            {/* Ring cell */}
            <div style={{flex:1,background:isUsed?`${at.color}22`:"#0A0E1A",
              border:`1px solid ${isUsed?at.borderColor:"#1E2A35"}`,
              borderRadius:4,padding:"4px 8px",display:"flex",alignItems:"center",gap:5}}>
              {ringCond&&<span style={{fontSize:9,color:"#FFD54F",fontWeight:"bold",fontFamily:"'Share Tech Mono',monospace"}}>{ringCond.label}</span>}
              <span style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",color:isUsed?at.lightColor:"#37474F",marginLeft:ringCond?0:"auto"}}>{p.ring}</span>
              <WireStripe color={p.ringHex} stripe={null} size={16}/>
            </div>
          </div>
        );
      })}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
        <div style={{fontSize:9,color:"#546E7A",fontFamily:"'Share Tech Mono',monospace",width:72,textAlign:"right"}}>X-CONN</div>
        <div style={{flex:1,borderTop:"1px dashed #263238"}}/>
        <div style={{fontSize:9,color:"#37474F",fontFamily:"'Share Tech Mono',monospace"}}>→ jumper to 66 block right side</div>
      </div>
    </div>
  );
}

// ── 25-pair table ─────────────────────────────────────────────────
function PairTable({at,startPort}) {
  const [showAll,setShowAll]=useState(false);
  const offset=(startPort-1)*at.pairsUsed;
  const usedNums=Array.from({length:at.pairsUsed},(_,i)=>offset+i+1);
  const display=showAll?PAIR_25:PAIR_25.slice(0,12);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"34px 26px 70px 26px 70px 80px 70px",
        background:"#0A131C",borderBottom:"1px solid #1E2A35"}}>
        {["PAIR","","TIP","","RING","CONDUCTOR","ACTION"].map((h,i)=>(
          <div key={i} style={{padding:"5px 6px",fontSize:8,color:"#546E7A",
            letterSpacing:1.5,textAlign:"center",fontFamily:"'Share Tech Mono',monospace"}}>{h}</div>
        ))}
      </div>
      {display.map((p,idx)=>{
        const isUsed=usedNums.includes(p.pair);
        const condIdx=usedNums.indexOf(p.pair);
        const tipC  =isUsed&&condIdx>=0?at.conductors.filter(c=>c.role==="tip")[condIdx]:null;
        const ringC =isUsed&&condIdx>=0?at.conductors.filter(c=>c.role==="ring")[condIdx]:null;
        return (
          <div key={p.pair} style={{
            display:"grid",gridTemplateColumns:"34px 26px 70px 26px 70px 80px 70px",
            background:isUsed?`${at.color}18`:idx%2===0?"#0D1117":"#0A0E1A",
            borderBottom:"1px solid #1A2330",
            borderLeft:isUsed?`3px solid ${at.color}`:"3px solid transparent",
            transition:"all 0.25s"}}>
            <div style={{padding:"6px 4px",textAlign:"center",fontSize:11,fontWeight:"bold",
              color:isUsed?at.lightColor:"#455A64",fontFamily:"'Share Tech Mono',monospace"}}>{p.pair}</div>
            <div style={{padding:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <WireStripe color={p.tipHex} stripe={p.tipStripe} size={18}/>
            </div>
            <div style={{padding:"6px 4px",textAlign:"center",fontSize:9,
              color:isUsed?at.lightColor:"#37474F",fontFamily:"'Share Tech Mono',monospace",
              fontWeight:isUsed?"bold":"normal"}}>
              {p.tip}{tipC?` → ${tipC.label}`:""}
            </div>
            <div style={{padding:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <WireStripe color={p.ringHex} stripe={null} size={18}/>
            </div>
            <div style={{padding:"6px 4px",textAlign:"center",fontSize:9,
              color:isUsed?at.lightColor:"#37474F",fontFamily:"'Share Tech Mono',monospace",
              fontWeight:isUsed?"bold":"normal"}}>
              {p.ring}{ringC?` → ${ringC.label}`:""}
            </div>
            <div style={{padding:"6px 4px",textAlign:"center",fontSize:9,
              color:isUsed?at.lightColor:"#263238",fontFamily:"'Share Tech Mono',monospace"}}>
              {isUsed?(tipC?.label||"")+"/"+(ringC?.label||""):"—"}
            </div>
            <div style={{padding:"6px 4px",textAlign:"center",fontSize:10,
              color:isUsed?"#A5D6A7":"#37474F",fontFamily:"'Share Tech Mono',monospace",
              fontWeight:isUsed?"bold":"normal"}}>
              {isUsed?"✓ PUNCH":"skip"}
            </div>
          </div>
        );
      })}
      {!showAll&&(
        <div onClick={()=>setShowAll(true)} style={{padding:"10px",textAlign:"center",
          fontSize:11,color:"#546E7A",cursor:"pointer",background:"#0A0E1A",
          borderTop:"1px solid #1E2A35",fontFamily:"'Share Tech Mono',monospace"}}>
          ▼ Show all 25 pairs
        </div>
      )}
    </div>
  );
}

// ── MDF pair map visual ───────────────────────────────────────────
const PAIR_BAND_COLORS = ['#1565C0','#E65100','#1B5E20','#4E342E','#607D8B']; // BL O G BR S
const BINDER_BORDERS  = ['#FFFFFF','#C62828','#212121','#F9A825','#6A1B9A'];  // W R BK Y V
const PORT_PALETTE = [
  '#0D47A1','#880E4F','#1B5E20','#4A148C',
  '#E65100','#37474F','#1A237E','#BF360C',
];

function MDFMapVisual({card}) {
  const pairBandColor = pos => PAIR_BAND_COLORS[(pos-1)%5];
  const binderBorder  = pos => BINDER_BORDERS[Math.floor((pos-1)/5)];
  const portColor     = port => PORT_PALETTE[(port-1)%PORT_PALETTE.length];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {/* Binder group header */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4,marginBottom:2}}>
        {['W (1–5)','R (6–10)','BK (11–15)','Y (16–20)','V (21–25)'].map((b,i)=>(
          <div key={b} style={{
            padding:'3px 0',textAlign:'center',fontSize:8,
            fontFamily:"'Share Tech Mono',monospace",
            color:BINDER_BORDERS[i]==='#FFFFFF'?'#CFD8DC':BINDER_BORDERS[i],
            borderTop:`2px solid ${BINDER_BORDERS[i]}`,
            background:'#0A131C',borderRadius:2,
          }}>{b}</div>
        ))}
      </div>

      {/* 25 pair cells */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(25,1fr)',gap:3}}>
        {Array.from({length:25},(_,i)=>i+1).map(pos=>{
          const entry = card.pairs[pos-1];
          const active = entry !== null;
          const isGnd  = entry?.type==='GND';
          const ss     = active&&!isGnd ? SIG_STYLES[entry.type] : null;
          const pc     = active&&!isGnd ? portColor(entry.port)   : null;

          return (
            <div key={pos} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
              {/* Pair number */}
              <div style={{fontSize:7,color:'#37474F',fontFamily:"'Share Tech Mono',monospace",
                lineHeight:1,textAlign:'center'}}>{pos}</div>
              {/* Cell */}
              <div style={{
                width:'100%',paddingBottom:'100%',position:'relative',
                borderRadius:3,
                background: isGnd?'#263238': active?pc:'#0A0E1A',
                border:`1px solid ${active?(ss?.border||'#78909C'):'#1E2A35'}`,
                borderTop:`3px solid ${binderBorder(pos)}`,
                boxShadow: active&&!isGnd?`0 0 4px ${pc}55`:'none',
                opacity: active?1:0.25,
              }}>
                <div style={{
                  position:'absolute',inset:0,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:6.5,fontWeight:'bold',
                  fontFamily:"'Share Tech Mono',monospace",
                  color: isGnd?'#90A4AE': ss?.border||'#fff',
                  lineHeight:1,
                }}>
                  {isGnd?'G': active?ss?.label.slice(0,2):''}
                </div>
              </div>
              {/* Port label */}
              <div style={{fontSize:6,color:active&&!isGnd?'#90A4AE':'transparent',
                fontFamily:"'Share Tech Mono',monospace",lineHeight:1}}>
                {active&&!isGnd?`P${entry.port}`:'·'}
              </div>
              {/* Pair color band */}
              <div style={{width:'80%',height:3,borderRadius:1,
                background:pairBandColor(pos),opacity:active?0.7:0.2}}/>
            </div>
          );
        })}
      </div>

      {/* Pair color key row */}
      <div style={{display:'flex',gap:4,marginTop:4,flexWrap:'wrap'}}>
        {['BL pair','O pair','G pair','BR pair','S/Slate pair'].map((lbl,i)=>(
          <div key={lbl} style={{display:'flex',alignItems:'center',gap:4,fontSize:8,
            color:'#546E7A',fontFamily:"'Share Tech Mono',monospace"}}>
            <div style={{width:10,height:10,borderRadius:2,background:PAIR_BAND_COLORS[i]}}/>
            {lbl}
          </div>
        ))}
        <div style={{marginLeft:'auto',fontSize:8,color:'#37474F'}}>Color = 25-pair band</div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function PunchGuide() {
  const [portType,setPortType]=useState("dcp2");
  const [startPort,setStartPort]=useState(1);
  const [tab,setTab]=useState("jack");
  const [selCard,setSelCard]=useState(CARD_MAPS[0]);
  const activePairs = selCard.pairs.filter(p=>p&&p.type!=='GND').length;
  const pairsPerPort = activePairs / selCard.ports;
  const at=PORT_TYPES.find(p=>p.id===portType);

  const offset=(startPort-1)*at.pairsUsed;
  const pairStart=offset+1;
  const row110=Math.ceil(pairStart/25);
  const pairInRow=(offset%25)+1;
  const clipGroup=Math.ceil(pairInRow/6);

  const tabs=[
    {id:"jack",   label:"Cat5 Jack"},
    {id:"b110",   label:"110 MDF Block"},
    {id:"b66",    label:"66 Block"},
    {id:"pairs",  label:"25-Pair Colors"},
    {id:"mdfmap", label:"MDF Pair Map"},
    {id:"labels", label:"Labels & Key"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0A0E1A",
      fontFamily:"'Share Tech Mono',monospace",color:"#CFD8DC",padding:"18px 14px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#0A0E1A;}
        ::-webkit-scrollbar-thumb{background:#263238;border-radius:3px;}
        button:hover{filter:brightness(1.2);}
      `}</style>

      <div style={{maxWidth:820,margin:"0 auto"}}>

        {/* Header */}
        <div style={{borderLeft:"4px solid #1565C0",paddingLeft:14,marginBottom:18}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:25,fontWeight:800,
            color:"#E3F2FD",letterSpacing:1,lineHeight:1.1}}>
            DEFINITY PUNCHDOWN REFERENCE
          </div>
          <div style={{fontSize:10,color:"#455A64",letterSpacing:3,marginTop:3}}>
            CAT5 JACK · 110 MDF BLOCK · 66 BLOCK · 25-PAIR COLORS · LABELING KEY
          </div>
        </div>

        {/* Correction notice */}
        <div style={{background:"#1A0A00",border:"1px solid #E65100",borderRadius:6,
          padding:"10px 14px",marginBottom:16,
          fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#FFCC80",lineHeight:1.8}}>
          <span style={{color:"#FF7043",fontWeight:"bold",letterSpacing:1}}>⚠ DCP 4-WIRE PIN CORRECTION: </span>
          Per Avaya diagram (J.Neuhaus, 12 Jan 2008) — 8400-series uses pins <span style={{color:"#FFD54F",fontWeight:"bold"}}>1, 2, 3, 5</span>.
          Pin 4 (Bu/W) is NOT used for DCP. Pin 6 (Gn/W) = speakerphone power only.
          This differs from standard Ethernet T568B usage.
        </div>

        {/* Controls */}
        <div style={{display:"flex",gap:14,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <div style={{fontSize:9,color:"#546E7A",letterSpacing:2}}>PORT TYPE</div>
            <div style={{display:"flex",gap:5}}>
              {PORT_TYPES.map(pt=>(
                <button key={pt.id} onClick={()=>{setPortType(pt.id);setStartPort(1);}} style={{
                  padding:"6px 12px",
                  background:portType===pt.id?pt.color:"#0D1117",
                  border:`2px solid ${portType===pt.id?pt.lightColor:pt.borderColor}`,
                  borderRadius:4,color:portType===pt.id?pt.lightColor:pt.borderColor,
                  fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                  letterSpacing:1,cursor:"pointer",transition:"all 0.2s"}}>
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <div style={{fontSize:9,color:"#546E7A",letterSpacing:2}}>PORT # ON CARD</div>
            <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>{
                const maxPort = at.maxPorts || 8;
                if(n>maxPort) return null;
                return (
                  <button key={n} onClick={()=>setStartPort(n)} style={{
                    width:28,height:28,
                    background:startPort===n?at.color:"#0D1117",
                    border:`1px solid ${startPort===n?at.lightColor:at.borderColor+"44"}`,
                    borderRadius:3,color:startPort===n?at.lightColor:at.borderColor,
                    fontFamily:"'Share Tech Mono',monospace",fontSize:11,
                    cursor:"pointer",transition:"all 0.2s"}}>{n}</button>
                );
              })}
              <div style={{fontSize:10,color:"#455A64",paddingLeft:6}}>→ amp pair {pairStart}</div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",gap:1,borderBottom:"2px solid #1E2A35"}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"7px 15px",background:tab===t.id?"#0D1117":"transparent",
              border:"none",borderBottom:tab===t.id?`2px solid ${at.color}`:"2px solid transparent",
              marginBottom:-2,color:tab===t.id?at.lightColor:"#546E7A",
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
              letterSpacing:1,cursor:"pointer",transition:"all 0.2s"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{background:"#0D1117",border:"1px solid #1E2A35",
          borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden"}}>

          {/* ── Jack tab ── */}
          {tab==="jack"&&(
            <div>
              <SHdr title="CAT5E SURFACE JACK — T568B PUNCHDOWN"/>
              <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:0}}>
                <div style={{padding:"18px 12px",display:"flex",alignItems:"flex-start",
                  justifyContent:"center",borderRight:"1px solid #1E2A35"}}>
                  <JackDiagram at={at}/>
                </div>
                <div style={{padding:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,
                    color:at.lightColor,letterSpacing:1,marginBottom:10,paddingBottom:8,
                    borderBottom:`1px solid ${at.borderColor}33`}}>{at.label}</div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:"#546E7A",letterSpacing:2,marginBottom:4}}>PAIRS / PINS USED</div>
                    {at.pairs.map((p,i)=><div key={i} style={{fontSize:10,color:"#90A4AE",
                      paddingLeft:7,borderLeft:`2px solid ${at.borderColor}`,marginBottom:3}}>{p}</div>)}
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:"#546E7A",letterSpacing:2,marginBottom:4}}>SIGNAL ASSIGNMENTS</div>
                    {at.signals.map((s,i)=><div key={i} style={{fontSize:10,color:"#CFD8DC",
                      paddingLeft:7,borderLeft:`2px solid ${at.borderColor}`,marginBottom:3}}>{s}</div>)}
                  </div>
                  <div style={{background:`${at.color}20`,border:`1px solid ${at.borderColor}55`,
                    borderRadius:4,padding:"7px 10px",fontSize:10,color:at.lightColor}}>
                    ⚑ {at.note}
                  </div>
                </div>
              </div>
              {/* Pin table */}
              <div style={{borderTop:"1px solid #1E2A35"}}>
                <div style={{background:"#0A131C",padding:"7px 16px",fontSize:9,color:"#546E7A",letterSpacing:2}}>
                  ALL 8 PINS — T568B
                </div>
                <div style={{display:"grid",
                  gridTemplateColumns:"34px 28px 58px 1fr 80px 70px",
                  background:"#0A131C",borderBottom:"1px solid #1E2A35"}}>
                  {["PIN","","CODE","PAIR / COLOR","DEFINITY","PUNCH?"].map(h=>(
                    <div key={h} style={{padding:"5px 6px",fontSize:8,color:"#546E7A",
                      letterSpacing:1.5,textAlign:"center",fontFamily:"'Share Tech Mono',monospace"}}>{h}</div>
                  ))}
                </div>
                {PIN_DATA.map((p,idx)=>{
                  const active=at.pins.includes(p.pin);
                  const isSpkr=p.definity==="SPKR PWR";
                  return (
                    <div key={p.pin} style={{
                      display:"grid",gridTemplateColumns:"34px 28px 58px 1fr 80px 70px",
                      background:active?`${at.color}18`:idx%2===0?"#0D1117":"#0A0E1A",
                      borderBottom:"1px solid #1A2330",
                      borderLeft:active?`3px solid ${at.color}`:isSpkr?"3px solid #37474F55":"3px solid transparent",
                      transition:"all 0.3s"}}>
                      <div style={{padding:"7px 4px",textAlign:"center",fontSize:12,
                        fontWeight:"bold",color:active?at.lightColor:"#455A64"}}>{p.pin}</div>
                      <div style={{padding:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <WireStripe color={p.color} stripe={p.stripe} size={20}/>
                      </div>
                      <div style={{padding:"7px 4px",textAlign:"center",fontSize:10,
                        color:active?at.lightColor:"#37474F",fontWeight:active?"bold":"normal"}}>{p.label}</div>
                      <div style={{padding:"7px 8px",fontSize:10,color:"#546E7A"}}>{p.pair}</div>
                      <div style={{padding:"7px 4px",textAlign:"center",fontSize:10,fontWeight:"bold",
                        color:active?at.lightColor:isSpkr?"#546E7A":"#263238"}}>{p.definity}</div>
                      <div style={{padding:"7px 4px",textAlign:"center",fontSize:10,
                        color:active?"#A5D6A7":isSpkr?"#546E7A":"#37474F",
                        fontWeight:active?"bold":"normal"}}>
                        {active?"✓ PUNCH":isSpkr?"opt PWR":"skip"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 110 tab ── */}
          {tab==="b110"&&(
            <div>
              <SHdr title="110 AC2-300SBM/6 — MDF CROSS-CONNECT"/>
              <div style={{padding:16}}>
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:6,
                  padding:"9px 14px",marginBottom:14,fontSize:10,color:"#78909C",
                  lineHeight:2,fontFamily:"'Share Tech Mono',monospace"}}>
                  <div style={{color:"#FFD54F",fontSize:9,letterSpacing:2,marginBottom:3}}>SIGNAL FLOW</div>
                  <span style={{color:at.lightColor}}>Definity backplane</span>
                  <span style={{color:"#37474F"}}> → Amphenol → </span>
                  <span style={{color:at.lightColor}}>110 cable side</span>
                  <span style={{color:"#37474F"}}> → </span>
                  <span style={{color:"#FFD54F"}}>C-clip</span>
                  <span style={{color:"#37474F"}}> → </span>
                  <span style={{color:at.lightColor}}>110 x-conn</span>
                  <span style={{color:"#37474F"}}> → 2-wire jumper → </span>
                  <span style={{color:at.lightColor}}>66 right side → station cable → jack</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                  {[
                    ["110 ROW",`Row ${row110}`,"of 12"],
                    ["PAIR IN ROW",`${pairInRow}–${Math.min(pairInRow+at.pairsUsed-1,25)}`,"of 25 per row"],
                    ["CLIP GROUP",`Group ${clipGroup}`,"6 pairs per clip"],
                  ].map(([lbl,val,sub])=>(
                    <div key={lbl} style={{background:`${at.color}18`,border:`1px solid ${at.borderColor}33`,
                      borderRadius:6,padding:"9px 12px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#546E7A",letterSpacing:2,marginBottom:2}}>{lbl}</div>
                      <div style={{fontSize:20,fontWeight:"bold",color:at.lightColor,
                        fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{val}</div>
                      <div style={{fontSize:9,color:"#546E7A",marginTop:2}}>{sub}</div>
                    </div>
                  ))}
                </div>
                <Block110 at={at} startPort={startPort}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                  <InfoCard label="CABLE SIDE (DONE)" body="Amphenol 25-pair punched per 25-pair sequence to bottom of clip. Typically factory-terminated — do not disturb."/>
                  <InfoCard label="X-CONN SIDE (YOUR WORK)" body="Punch 2-wire jumper to TOP of same clip pair. Straight across — same pair position as cable side."/>
                  <InfoCard label="C-CLIPS PRE-INSTALLED" body="This is a prewired Avaya AC2-300SBM/6 — connecting clips are already installed from the factory. Do not remove clips unnecessarily. Pull clip to isolate a port for testing without disturbing punchdowns." accent="#A5D6A7"/>
                  <InfoCard label="POLARITY — NEVER SWAP" body="White-dominant = always Tip. Solid color = always Ring. At every termination point — 110, 66, and jack."/>
                </div>
              </div>
            </div>
          )}

          {/* ── 66 tab ── */}
          {tab==="b66"&&(
            <div>
              <SHdr title="66 BLOCK — ROW SEQUENCE"/>
              <div style={{padding:16}}>
                <div style={{display:"grid",
                  gridTemplateColumns:`repeat(${at.conductors.length},1fr)`,
                  gap:8,marginBottom:14}}>
                  {at.conductors.map((c,i)=>(
                    <div key={c.label} style={{background:`${at.color}18`,
                      border:`1px solid ${at.borderColor}44`,borderRadius:6,
                      padding:"10px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#546E7A",marginBottom:3,letterSpacing:1}}>
                        ROW {at.rowLabels[i]}
                      </div>
                      <div style={{fontSize:20,fontWeight:"bold",color:at.lightColor,
                        fontFamily:"'Barlow Condensed',sans-serif"}}>{c.label}</div>
                      <div style={{fontSize:10,color:"#90A4AE",marginTop:3}}>{c.wire}</div>
                      <div style={{fontSize:9,color:"#546E7A"}}>Jack pin {c.jackPin}</div>
                      <div style={{fontSize:8,color:c.role==="tip"?"#80DEEA":"#EF9A9A",
                        marginTop:3,letterSpacing:1}}>{c.role.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",
                  borderRadius:6,padding:"11px 14px",fontSize:10,color:"#546E7A",lineHeight:2}}>
                  <div style={{color:"#FFD54F",marginBottom:4,fontSize:9,letterSpacing:2}}>66 BLOCK RULES</div>
                  Station cable → <span style={{color:at.lightColor}}>LEFT side</span> (cols 1–2) &nbsp;|&nbsp;
                  Cross-connect → <span style={{color:at.lightColor}}>RIGHT side</span> (cols 3–4)<br/>
                  Bridge clip connects left and right &nbsp;|&nbsp;
                  <span style={{color:"#FFD54F"}}>Pull clip to isolate port for testing</span><br/>
                  {at.id==="dcp2"&&<><span style={{color:at.lightColor}}>4 rows per station</span> · 50-row M66 = 12 stations per block</>}
                  {at.id==="dcp1"&&<><span style={{color:at.lightColor}}>2 rows per station</span> · 50-row M66 = 25 stations per block</>}
                  {at.id==="analog"&&<><span style={{color:at.lightColor}}>2 rows per station</span> · 50-row M66 = 25 stations per block</>}
                  {at.id==="hybrid"&&<><span style={{color:at.lightColor}}>3 rows per station</span> (T/R/A-lead) · 50-row M66 = 16 stations per block</>}
                  {at.id==="bri"&&<><span style={{color:at.lightColor}}>4 rows per circuit</span> · 50-row M66 = 12 circuits per block · <span style={{color:"#A5D6A7",fontWeight:"bold"}}>NO pair skipping</span></>}
                </div>
                {at.id==="bri"&&(
                  <div style={{marginTop:8,background:"#003833",border:"1px solid #00897B",
                    borderRadius:6,padding:"11px 14px",fontSize:10,lineHeight:1.9}}>
                    <div style={{color:"#FFD54F",marginBottom:6,fontSize:9,letterSpacing:2}}>⚠ BRI COLOR TRANSLATION — 66 BLOCK</div>
                    <div style={{color:"#80CBC4",marginBottom:8}}>
                      The 25-pair Amphenol side and the Cat5 station cable side use different pair colors at the 66 block.
                      The cross-connect wire (blue spool) bridges them — polarity is your only reference.
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                      {[
                        {left:"W-BL (PXR)",  leftHex:"#1E3A5F",  leftStr:"#1565C0", right:"W/Bu → Pin 5", rightHex:"#1E3A5F", rightStr:"#1565C0"},
                        {left:"BL-W (PXT)", leftHex:"#1565C0",  leftStr:null,      right:"Bu/W → Pin 4", rightHex:"#1565C0", rightStr:null},
                        {left:"W-O (TXT)",   leftHex:"#2C1810",  leftStr:"#E65100", right:"W/Gn → Pin 3", rightHex:"#1A2E1A", rightStr:"#1B5E20"},
                        {left:"O-W (TXR)",  leftHex:"#E65100",  leftStr:null,      right:"Gn/W → Pin 6", rightHex:"#1B5E20", rightStr:null},
                      ].map((r,i)=>(
                        <div key={i} style={{display:"contents"}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,
                            background:"#0A1F1C",borderRadius:4,padding:"5px 8px"}}>
                            <WireStripe color={r.leftHex} stripe={r.leftStr} size={16}/>
                            <span style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",color:"#80CBC4"}}>{r.left}</span>
                          </div>
                          <div style={{textAlign:"center",fontSize:10,color:"#455A64"}}>→</div>
                          <div style={{display:"flex",alignItems:"center",gap:6,
                            background:"#0A1F1C",borderRadius:4,padding:"5px 8px"}}>
                            <WireStripe color={r.rightHex} stripe={r.rightStr} size={16}/>
                            <span style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",color:"#E0F7FA"}}>{r.right}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:8,fontSize:9,color:"#546E7A",lineHeight:1.7}}>
                      ⚐ Source: Avaya 555-245-773 Issue 4.1 Jun 2005 (TN556D). TN556C assumed equivalent.<br/>
                      PXR/PXT = PBX transmit pair (blue pair, pins 4/5) · TXT/TXR = Terminal transmit pair (green pair, pins 3/6)
                    </div>
                    <div style={{marginTop:8,background:"#7B1A1A33",border:"1px solid #EF535388",
                      borderRadius:4,padding:"8px 10px",fontSize:10,color:"#EF9A9A",lineHeight:1.8}}>
                      <span style={{fontWeight:"bold",letterSpacing:1}}>⚠ 100Ω TERMINATING RESISTOR REQUIRED</span><br/>
                      A terminating resistor must be installed near each BRI terminal or the circuit will not train up.<br/>
                      Options: <span style={{color:"#FFD54F"}}>440A4 adapter</span> at the wall jack &nbsp;|&nbsp;
                      <span style={{color:"#FFD54F"}}>Avaya 110RA1-12 block</span> at the MDF (handles all 12 circuits)<br/>
                      Max run: <span style={{color:"#FFD54F"}}>1900 ft @ 24 AWG</span> per Avaya spec.
                    </div>
                  </div>
                )}
                {/* conductor → amp pair mapping */}
                <div style={{marginTop:10,background:"#0A131C",border:"1px solid #1E2A35",
                  borderRadius:6,padding:"11px 14px"}}>
                  <div style={{fontSize:9,color:"#FFD54F",letterSpacing:2,marginBottom:8}}>
                    66 RIGHT SIDE → 110 PAIR MAPPING — PORT {startPort}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:6}}>
                    {at.conductors.map((c,i)=>{
                      const pNum=offset+Math.floor(i/2)+1;
                      const pair=PAIR_25[pNum-1];
                      const wire=c.role==="tip"?pair?.tip:pair?.ring;
                      const hex=c.role==="tip"?pair?.tipHex:pair?.ringHex;
                      const str=c.role==="tip"?pair?.tipStripe:null;
                      return (
                        <div key={c.label} style={{display:"flex",alignItems:"center",gap:7,
                          padding:"6px 8px",background:`${at.color}10`,borderRadius:4,
                          border:`1px solid ${at.borderColor}22`}}>
                          <WireStripe color={hex||"#333"} stripe={str} size={16}/>
                          <div style={{fontSize:9,fontFamily:"'Share Tech Mono',monospace",color:at.lightColor}}>
                            <span style={{color:"#FFD54F"}}>{c.label}</span> · {wire} · P{pNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 25-pair tab ── */}
          {tab==="pairs"&&(
            <div>
              <SHdr title="25-PAIR COLOR SEQUENCE — FULL REFERENCE"/>
              <div style={{padding:"10px 16px 8px",fontSize:10,color:"#546E7A",lineHeight:1.7}}>
                Highlighted = pairs for <span style={{color:at.lightColor}}>Port {startPort} / {at.label}</span>.
                Use port selector above to check any port.
              </div>
              <PairTable at={at} startPort={startPort}/>
            </div>
          )}

          {/* ── MDF Pair Map tab ── */}
          {tab==="mdfmap"&&(
            <div>
              <SHdr title="MDF PAIR MAP — AMPHENOL 25-PAIR CROSS-CONNECT REFERENCE"/>
              <div style={{padding:16,display:'flex',flexDirection:'column',gap:14}}>

                {/* Source note */}
                <div style={{background:'#0A131C',border:'1px solid #1E2A35',borderRadius:6,
                  padding:'9px 14px',fontSize:10,color:'#546E7A',lineHeight:1.8}}>
                  <span style={{color:'#FFD54F'}}>Source: </span>
                  Official Avaya cross-connect diagram (KLC 063097). Each of the 25 columns
                  represents one pair of the Amphenol 25-pair connector. Color bands show
                  which of the 5 pair types (BL/O/G/BR/S) that position is in the 25-pair sequence.
                  Top border color = binder group (W/R/BK/Y/V). Hybrid card excluded per installation plan.
                </div>

                {/* Card selector */}
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{fontSize:9,color:'#546E7A',letterSpacing:2}}>SELECT CARD TYPE</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {CARD_MAPS.map(c=>(
                      <button key={c.tn} onClick={()=>setSelCard(c)} style={{
                        padding:'5px 10px',
                        background:selCard.tn===c.tn?c.color:'#0D1117',
                        border:`1px solid ${selCard.tn===c.tn?'#fff':c.color+'66'}`,
                        borderRadius:4,
                        color:selCard.tn===c.tn?'#fff':c.color,
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontSize:12,fontWeight:700,letterSpacing:1,
                        cursor:'pointer',transition:'all 0.2s',
                      }}>{c.tn}</button>
                    ))}
                  </div>
                </div>

                {/* Card info bar */}
                <div style={{background:`${selCard.color}18`,border:`1px solid ${selCard.color}44`,
                  borderRadius:6,padding:'10px 14px',
                  display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                  <div>
                    <div style={{fontSize:9,color:'#546E7A',letterSpacing:1.5,marginBottom:3}}>CARD</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:20,fontWeight:700,color:'#E3F2FD'}}>{selCard.tn}</div>
                    <div style={{fontSize:10,color:'#90A4AE'}}>{selCard.name}</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:'#546E7A',letterSpacing:1.5,marginBottom:3}}>PORTS</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:20,fontWeight:700,color:'#E3F2FD'}}>{selCard.ports}</div>
                    <div style={{fontSize:10,color:'#90A4AE'}}>{pairsPerPort} pair{pairsPerPort>1?'s':''}/port</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:'#546E7A',letterSpacing:1.5,marginBottom:3}}>PAIRS USED</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:20,fontWeight:700,color:'#E3F2FD'}}>
                      {activePairs}
                    </div>
                    <div style={{fontSize:10,color:'#90A4AE'}}>{selCard.desc}</div>
                  </div>
                </div>

                {/* Visual map */}
                <div style={{background:'#0D1117',border:'1px solid #1E2A35',
                  borderRadius:6,padding:'12px',overflowX:'auto'}}>
                  <div style={{minWidth:500}}>
                    <MDFMapVisual card={selCard}/>
                  </div>
                </div>

                {/* Signal type legend */}
                <div style={{background:'#0A131C',border:'1px solid #1E2A35',
                  borderRadius:6,padding:'10px 14px'}}>
                  <div style={{fontSize:9,color:'#FFD54F',letterSpacing:2,marginBottom:8}}>SIGNAL TYPE LEGEND</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {Object.entries(SIG_STYLES).map(([key,ss])=>(
                      <div key={key} style={{display:'flex',alignItems:'center',gap:6,
                        background:`${ss.bg}33`,border:`1px solid ${ss.border}44`,
                        borderRadius:4,padding:'5px 8px',minWidth:80}}>
                        <div style={{width:18,height:18,borderRadius:3,
                          background:ss.bg,border:`1px solid ${ss.border}`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:7,color:ss.border,fontWeight:'bold',
                          fontFamily:"'Share Tech Mono',monospace"}}>{ss.label}</div>
                        <div>
                          <div style={{fontSize:9,color:ss.border,fontFamily:"'Share Tech Mono',monospace",
                            fontWeight:'bold'}}>{key}</div>
                          <div style={{fontSize:8,color:'#546E7A'}}>{ss.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick reference note */}
                <div style={{background:'#0A131C',border:'1px solid #1E2A35',
                  borderRadius:6,padding:'10px 14px',fontSize:10,color:'#546E7A',lineHeight:1.9}}>
                  <span style={{color:'#FFD54F'}}>Reading the map: </span>
                  Each square = one 25-pair Amphenol pair. Top border color = binder group.
                  Bottom color band = pair type within binder (BL/O/G/BR/S).
                  Port number shown below active squares. Dimmed squares = unused on that card.
                  Pair 25 (V/S) is commonly used as ground (G) when the card uses all 24 active pairs.
                </div>

              </div>
            </div>
          )}

          {/* ── Labels tab ── */}
          {tab==="labels"&&(
            <div>
              <SHdr title="CABLE LABELS & GRAPHICAL KEY"/>
              <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>

                {/* Cross-connect wire polarity reminder */}
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:6,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:"#FFD54F",letterSpacing:2,marginBottom:8}}>CROSS-CONNECT WIRE — SINGLE TWISTED PAIR (BLUE SPOOL)</div>
                  <div style={{fontSize:10,color:"#78909C",lineHeight:1.8,marginBottom:10}}>
                    Since all cross-connect jumpers use the same blue/white-blue pair, color alone cannot identify port type or signal at the 66 block.
                    Polarity discipline and labeling are your only references.
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {[
                      {hex:"#1565C0",stripe:null,      label:"Blue",       role:"RING",  sig:"R1 / R2 / R",  color:"#EF9A9A"},
                      {hex:"#1E3A5F",stripe:"#1565C0", label:"White/Blue", role:"TIP",   sig:"T1 / T2 / T",  color:"#80DEEA"},
                    ].map(w=>(
                      <div key={w.role} style={{flex:1,background:`${w.color}11`,
                        border:`1px solid ${w.color}44`,borderRadius:5,
                        padding:"10px",display:"flex",alignItems:"center",gap:10}}>
                        <WireStripe color={w.hex} stripe={w.stripe} size={28}/>
                        <div>
                          <div style={{fontSize:9,color:w.color,letterSpacing:2,fontWeight:"bold"}}>{w.role}</div>
                          <div style={{fontSize:11,color:"#CFD8DC",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{w.label}</div>
                          <div style={{fontSize:9,color:"#546E7A",marginTop:2}}>{w.sig}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Label anatomy */}
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:6,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:"#FFD54F",letterSpacing:2,marginBottom:10}}>CABLE LABEL ANATOMY</div>
                  {/* Sample label mockup */}
                  <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                    <div style={{
                      background:"#FFFDE7",border:"2px solid #F9A825",borderRadius:4,
                      padding:"8px 14px",fontFamily:"'Barlow Condensed',sans-serif",
                      color:"#212121",display:"inline-flex",gap:0,alignItems:"stretch",
                      fontSize:13,fontWeight:700,letterSpacing:1,
                    }}>
                      {[
                        {val:"DCP2", bg:"#0D47A1", fc:"#E3F2FD", tip:"Port type"},
                        {val:"|",   bg:"#F9A825", fc:"#212121", tip:""},
                        {val:"C1",  bg:"#263238", fc:"#ECEFF1", tip:"Cabinet"},
                        {val:"·",   bg:"#F9A825", fc:"#212121", tip:""},
                        {val:"S05", bg:"#263238", fc:"#ECEFF1", tip:"Slot"},
                        {val:"·",   bg:"#F9A825", fc:"#212121", tip:""},
                        {val:"P03", bg:"#263238", fc:"#ECEFF1", tip:"Port #"},
                        {val:"|",   bg:"#F9A825", fc:"#212121", tip:""},
                        {val:"301", bg:"#1B5E20", fc:"#C8E6C9", tip:"Extension"},
                        {val:"|",   bg:"#F9A825", fc:"#212121", tip:""},
                        {val:"T1",  bg:"#80DEEA", fc:"#212121", tip:"Conductor"},
                      ].map((seg,i)=>(
                        <div key={i} style={{background:seg.bg,color:seg.fc,
                          padding:seg.val==="|"||seg.val==="·"?"0 4px":"4px 6px",
                          fontSize:seg.val==="|"||seg.val==="·"?16:12,
                          display:"flex",alignItems:"center",
                        }}>{seg.val}</div>
                      ))}
                    </div>
                  </div>
                  {/* Field key */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:6}}>
                    {[
                      {field:"PORT TYPE", example:"DCP2 / DCP1 / ANA", color:"#0D47A1", light:"#E3F2FD",
                        desc:"Color-coded by port type so blocks are visually scannable at a glance"},
                      {field:"CABINET",   example:"C1 or C2",           color:"#263238", light:"#ECEFF1",
                        desc:"Which CMC cabinet — matches Card Inventory spreadsheet"},
                      {field:"SLOT",      example:"S03 – S16",          color:"#263238", light:"#ECEFF1",
                        desc:"Card slot number on the carrier"},
                      {field:"PORT #",    example:"P01 – P16",          color:"#263238", light:"#ECEFF1",
                        desc:"Physical port number on the TN card"},
                      {field:"EXTENSION", example:"301, 302…",          color:"#1B5E20", light:"#C8E6C9",
                        desc:"Assigned extension — leave blank until administered in SAT"},
                      {field:"CONDUCTOR", example:"T1 R1 T2 R2 T R",   color:"#006064", light:"#80DEEA",
                        desc:"Which conductor this row carries — critical since all x-conn wire is same color"},
                    ].map(f=>(
                      <div key={f.field} style={{background:`${f.color}18`,
                        border:`1px solid ${f.color}44`,borderRadius:5,padding:"8px 10px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                          <div style={{background:f.color,color:f.light,
                            fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                            padding:"1px 6px",borderRadius:3}}>{f.example}</div>
                        </div>
                        <div style={{fontSize:9,color:"#FFD54F",letterSpacing:1.5,marginBottom:2}}>{f.field}</div>
                        <div style={{fontSize:9,color:"#78909C",lineHeight:1.6}}>{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Port type color key */}
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:6,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:"#FFD54F",letterSpacing:2,marginBottom:8}}>PORT TYPE COLOR KEY — 66 BLOCK DESIGNATION STRIPS</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {PORT_TYPES.map(pt=>(
                      <div key={pt.id} style={{flex:1,minWidth:140,
                        background:pt.color,border:`2px solid ${pt.lightColor}`,
                        borderRadius:5,padding:"10px 12px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontSize:18,fontWeight:700,color:pt.lightColor,letterSpacing:1}}>{pt.label}</div>
                        <div style={{fontSize:9,color:pt.lightColor,opacity:0.7,marginTop:4,lineHeight:1.6}}>
                          {pt.id==="dcp2"&&"4 rows / port · 12 ports per 50-row block"}
                          {pt.id==="dcp1"&&"2 rows / port · 25 ports per 50-row block"}
                          {pt.id==="analog"&&"2 rows / port · 25 ports per 50-row block"}
                          {pt.id==="bri"&&"4 rows / circuit · 12 circuits per card · no skipping"}
                          {pt.id==="hybrid"&&"3 rows / port · T/R/A-lead · 8 ports per TN762"}
                        </div>
                        <div style={{marginTop:6,padding:"4px 6px",
                          background:"rgba(0,0,0,0.3)",borderRadius:3,
                          fontSize:9,color:pt.lightColor,fontFamily:"'Share Tech Mono',monospace"}}>
                          {pt.id==="dcp2"&&"BLOCK: DCP-2P"}
                          {pt.id==="dcp1"&&"BLOCK: DCP-1P"}
                          {pt.id==="analog"&&"BLOCK: ANALOG"}
                          {pt.id==="bri"&&"BLOCK: BRI S/T"}
                          {pt.id==="hybrid"&&"BLOCK: HYBRID"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 66 block labeling tips */}
                <div style={{background:"#0A131C",border:"1px solid #1E2A35",borderRadius:6,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:"#FFD54F",letterSpacing:2,marginBottom:8}}>66 BLOCK ROW LABELING — SAMPLE LAYOUT</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#546E7A",marginBottom:8,lineHeight:1.7}}>
                    Each row on the designation strip should show port # and conductor. Since all cross-connect wire is blue/white-blue,
                    the conductor field is critical — it tells you which wire to punch without having to trace back to the 110.
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {[
                      {row:"01", port:"P01", cond:"T1/TXT", type:"DCP2", ext:"301", side:"L=station  R=x-conn"},
                      {row:"02", port:"P01", cond:"R1/TXR", type:"DCP2", ext:"301", side:"L=station  R=x-conn"},
                      {row:"03", port:"P01", cond:"T2/PXT", type:"DCP2", ext:"301", side:"L=station  R=x-conn"},
                      {row:"04", port:"P01", cond:"R2/PXR", type:"DCP2", ext:"301", side:"L=station  R=x-conn"},
                      {row:"05", port:"P02", cond:"T1/TXT", type:"DCP2", ext:"302", side:""},
                    ].map((r,i)=>(
                      <div key={r.row} style={{
                        display:"grid",gridTemplateColumns:"28px 40px 70px 50px 50px 1fr",
                        background:i%2===0?"#0D1117":"#0A0E1A",
                        borderRadius:3,padding:"4px 8px",gap:8,alignItems:"center",
                        borderLeft:i<4?"3px solid #0D47A1":"3px solid #0D47A1",
                      }}>
                        <div style={{fontSize:9,color:"#455A64"}}>R{r.row}</div>
                        <div style={{fontSize:9,color:"#78909C",fontWeight:"bold"}}>{r.port}</div>
                        <div style={{fontSize:9,color:"#FFD54F"}}>{r.cond}</div>
                        <div style={{fontSize:8,color:"#0D47A1",background:"#0D47A133",
                          borderRadius:2,padding:"1px 4px",textAlign:"center"}}>{r.type}</div>
                        <div style={{fontSize:9,color:"#A5D6A7"}}>{r.ext||"—"}</div>
                        <div style={{fontSize:8,color:"#37474F"}}>{r.side}</div>
                      </div>
                    ))}
                    <div style={{fontSize:9,color:"#546E7A",marginTop:6,lineHeight:1.7}}>
                      ↑ Rows 1–4 = one DCP 2-pair station (Port 1). Row 5 starts Port 2.
                      Extension column left blank until SAT administration is complete.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
