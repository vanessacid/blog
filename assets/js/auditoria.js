/* Auto-auditoría de Instagram · Vanessa Cid
   Los datos del formulario van a la hoja de leads a través de Apps Script.
   Si cambias los textos de la checklist aquí, cámbialos también en el Apps Script
   para que el correo diga lo mismo. */
(function(){
"use strict";
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwr24o-WJdrrZ-lDWmXmXRho29-QIqw5JwL0T9RwFem8-BhsMw_BEv6dD3ytC2GVT8_xw/exec";
const WHATSAPP = "34611789200";

const BLOQUES = [
  { id:"entiende", titulo:"Entré al perfil… ¿entendí qué hace?", corto:"Claridad", sub:"Sin pensar mucho",
    aviso:"👉 Si no lo entendiste rápido, hay algo que mejorar.",
    items:[
      ["En pocos segundos entendí a qué se dedica","Haz la prueba: enséñale tu perfil 3 segundos a alguien que no te conozca y pregúntale qué haces. Si duda, tu nombre y tu bio tienen que decirlo más directo."],
      ["Entendí qué vende u ofrece","No basta con «ayudo a personas». Di qué ofreces en concreto: sesiones de fisio, tartas por encargo, reformas de cocinas…"],
      ["Entendí si es producto o servicio","Que tus primeras publicaciones lo muestren: si vendes producto, que se vea el producto; si es servicio, que se te vea haciéndolo."],
      ["Entendí para quién es","Nombra a tu cliente: «para autónomos», «para familias de Vigo», «para novias». Cuando alguien se ve reflejado, se queda."]
    ]},
  { id:"confianza", titulo:"¿Me genera confianza?", corto:"Confianza", sub:"Lo compraría, visitaría o preguntaría",
    items:[
      ["Se ve profesional","Profesional no es perfecto. Es buena luz, imagen nítida y textos sin faltas. Con tu móvil y una ventana ya lo tienes."],
      ["Se ve cuidado","Elige 2 o 3 colores y una o dos tipografías y repítelos. La coherencia visual transmite que hay alguien detrás que se ocupa."],
      ["Parece un negocio real y activo","Enséñate: tu cara, tu local, tu equipo, tus clientes. Las personas compran a personas. Y que la última publicación no tenga meses."],
      ["Me daría confianza escribirle","Suma pruebas: reseñas, capturas de mensajes de clientes (con permiso), años de experiencia. Ponlo en un destacado de «Opiniones»."]
    ]},
  { id:"identidad", titulo:"Foto + nombre + usuario", corto:"Foto y nombre", sub:"Lo primero que ves",
    items:[
      ["La foto/logo se entiende bien","La foto de perfil se ve diminuta. Si eres marca personal, tu cara de cerca y sonriendo. Si es logo, versión simple, sin letras pequeñas."],
      ["El nombre ayuda a saber qué hace","El campo «Nombre» también aparece en búsquedas. Usa «Tu nombre | Lo que haces», por ejemplo «Laura | Nutricionista en Vigo»."],
      ["El usuario es claro y fácil de recordar","Evita guiones bajos raros, números y letras dobles. Dilo en voz alta: si tienes que deletrearlo, se puede simplificar."],
      ["No genera confusión","Que nombre, usuario y foto cuenten lo mismo. Si te llamas de una forma, el usuario es otra y el logo otra, la gente no te encuentra."]
    ]},
  { id:"bio", titulo:"Bio", corto:"Bio", sub:"La mini venta del perfil",
    items:[
      ["Explica qué hace","Primera línea: qué haces y para quién. Sin frases bonitas que no dicen nada. Claro gana a creativo."],
      ["Habla claro","Escríbela como se la dirías a alguien en persona. Si suena a folleto, reescríbela en voz alta."],
      ["Tiene alguna palabra clave importante","Incluye lo que tu cliente buscaría: tu servicio y tu ciudad. «Peluquería en Vigo» se encuentra; «Amor por el pelo» no."],
      ["Invita a hacer algo (escribir, reservar, comprar, visitar)","Termina con un siguiente paso: «Reserva tu cita ↓», «Pide presupuesto por WhatsApp ↓». Si no lo pides, no pasa."],
      ["Está ordenada y fácil de leer","Una idea por línea, 3 o 4 líneas máximo y algún emoji como viñeta. Nada de párrafos seguidos."]
    ]},
  { id:"contenido", titulo:"Contenido", corto:"Contenido", sub:"Baja un poco y mira publicaciones",
    items:[
      ["El contenido me ayuda a entender mejor el negocio","Fija arriba tus 3 mejores publicaciones: quién eres, qué haces y una prueba de resultados. Es tu escaparate."],
      ["Veo ejemplos, trabajos, resultados o productos","Enseña el antes y después, el proceso, el producto en uso. Mostrar vende más que contar."],
      ["El contenido se ve actual","No necesitas publicar a diario. Necesitas constancia: 2 o 3 veces por semana durante meses gana a 10 posts en una semana y luego nada."],
      ["Me dan ganas de seguir mirando","Cuida las portadas de los reels y la primera frase: tienes un segundo para que alguien se pare. Variedad: reels, carruseles y alguna foto tuya."],
      ["Aporta valor o resuelve dudas","Apunta las preguntas que te hacen los clientes y respóndelas en publicaciones. Es contenido infinito y te posiciona como quien sabe."]
    ]},
  { id:"accion", titulo:"¿Sé qué hacer ahora?", corto:"Siguiente paso", sub:"Si me interesa",
    items:[
      ["Sé cómo contactar","Activa los botones de contacto (WhatsApp, llamar o correo) desde «Editar perfil». Un toque y te escriben."],
      ["Sé cómo comprar o reservar","Pon un enlace directo a tu agenda, tienda o WhatsApp con mensaje preparado. Cada clic de más es un cliente menos."],
      ["Veo siguiente paso claro","Crea un destacado tipo «Empieza aquí» con precios orientativos, cómo trabajas y cómo reservar. Quita dudas antes de que pregunten."],
      ["El perfil invita a actuar","Cierra tus publicaciones con una llamada: «Escríbeme INFO», «Guarda esto», «Reserva en el enlace». La gente hace lo que le pides."]
    ],
    opciones:true }
];
const OPCIONES = [["👋","Me iría"],["👀","Miraría más"],["💬","Escribiría"],["🛒","Compraría"],["🔖","Guardaría para luego"]];

const TOTAL = BLOQUES.reduce((n,b)=>n+b.items.length,0);
const KEY = "vc-autoauditoria-v1";
const $ = id => document.getElementById(id);
let estado = { marcados:{}, opcion:null, enviado:false };
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) estado = Object.assign(estado, s); } catch(e){}
function guardar(){ try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch(e){} }

const svgCheck = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3L13 4.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function render(){
  $("aud-bloques").innerHTML = BLOQUES.map((b,i)=>`
    <section class="aud-bloque" id="aud-b-${b.id}">
      <header>
        <div class="aud-num">${i+1}</div>
        <div><h2>${b.titulo}</h2><div class="aud-sub">${b.sub}</div></div>
        <div class="aud-contador" id="aud-c-${b.id}"></div>
      </header>
      ${b.aviso ? `<p class="aud-aviso">${b.aviso}</p>` : ""}
      <ul class="aud-items">
        ${b.items.map((it,j)=>{ const k=b.id+"-"+j; return `
        <li class="aud-item ${estado.marcados[k]?"on":""}">
          <div class="aud-fila">
            <button class="aud-check" type="button" role="checkbox" aria-checked="${!!estado.marcados[k]}" data-k="${k}">
              <span class="aud-caja">${svgCheck}</span><span>${it[0]}</span>
            </button>
            <button class="aud-tipbtn" type="button" aria-expanded="false" aria-controls="aud-t-${k}">💡 Consejo</button>
          </div>
          <p class="aud-tip" id="aud-t-${k}">${it[1]}</p>
        </li>`}).join("")}
      </ul>
      ${b.opciones ? `
        <p class="aud-preg">📝 ¿Qué harías tú al entrar?</p>
        <div class="aud-opciones">${OPCIONES.map(o=>`<button class="aud-op" type="button" aria-pressed="${estado.opcion===o[1]}" data-op="${o[1]}"><span>${o[0]}</span>${o[1]}</button>`).join("")}</div>` : ""}
    </section>`).join("");
  $("aud-formbox").classList.toggle("enviado", !!estado.enviado);
}

function pct(b){ const n=b.items.filter((_,j)=>estado.marcados[b.id+"-"+j]).length; return {n, t:b.items.length, p:n/b.items.length}; }
function totalMarcados(){ return Object.values(estado.marcados).filter(Boolean).length; }
function fmt(n){ return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".",","); }

function actualizar(){
  const marcados = totalMarcados();
  const nota = Math.round(marcados/TOTAL*100)/10, notaTxt = fmt(nota);
  $("aud-cuenta").textContent = `${marcados} de ${TOTAL} marcados`;
  $("aud-barra").style.width = (marcados/TOTAL*100)+"%";
  $("aud-nota").textContent = notaTxt;
  const est = Math.round(nota/2);
  $("aud-estrellas").textContent = "★".repeat(est)+"☆".repeat(5-est);
  $("aud-npend").textContent = TOTAL - marcados;

  let v, m;
  if (marcados===0){ v="Empieza a marcar ☝️"; m="Ve bloque por bloque. Tu nota se calcula sola."; }
  else if (nota<4){ v="Tu perfil tiene mucho margen 🌱"; m="Buena noticia: los cambios más rápidos (nombre, bio y botones de contacto) son justo los que más se notan."; }
  else if (nota<6.5){ v="Vas por buen camino 💪"; m="Ya tienes una base. Ahora toca que quien entre entienda rápido qué haces y sepa cómo dar el siguiente paso."; }
  else if (nota<8.5){ v="¡Tu perfil está muy bien! ✨"; m="Estás por encima de la mayoría. Pule los detalles pendientes y tu perfil empezará a trabajar por ti."; }
  else { v="Perfil de 10 🔥"; m="Tu perfil se entiende, da confianza e invita a actuar. Ahora el reto es la constancia."; }
  $("aud-veredicto").textContent = v;
  $("aud-mensaje").textContent = m;

  $("aud-barras").innerHTML = BLOQUES.map(b=>{ const r=pct(b);
    return `<div><p><span>${b.corto}</span><span>${r.n}/${r.t}</span></p><i><b style="width:${r.p*100}%"></b></i></div>`; }).join("");
  BLOQUES.forEach(b=>{ const r=pct(b);
    $("aud-c-"+b.id).textContent = `${r.n}/${r.t}`;
    $("aud-b-"+b.id).classList.toggle("completo", r.n===r.t); });

  const txt = `Hola, Vanessa. He hecho la auto-auditoría de Instagram y me ha salido un ${notaTxt}/10. Me gustaría que revisáramos mi perfil.`;
  $("aud-wa").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(txt);
}

document.addEventListener("click", e=>{
  const c = e.target.closest(".aud-check");
  if (c){ const k=c.dataset.k; estado.marcados[k]=!estado.marcados[k];
    c.setAttribute("aria-checked", estado.marcados[k]); c.closest(".aud-item").classList.toggle("on", estado.marcados[k]);
    if (navigator.vibrate) try{navigator.vibrate(8)}catch(_){}
    guardar(); actualizar(); return; }
  const t = e.target.closest(".aud-tipbtn");
  if (t){ const tip=$(t.getAttribute("aria-controls")); const ab=!tip.classList.contains("open");
    tip.classList.toggle("open",ab); t.setAttribute("aria-expanded",ab); return; }
  const o = e.target.closest(".aud-op");
  if (o){ estado.opcion = estado.opcion===o.dataset.op ? null : o.dataset.op;
    document.querySelectorAll(".aud-op").forEach(x=>x.setAttribute("aria-pressed", x.dataset.op===estado.opcion)); guardar(); }
});

$("aud-form").addEventListener("submit", async e=>{
  e.preventDefault();
  const err = $("aud-error");
  const nombre = $("aud-nombre").value.trim();
  const email = $("aud-email").value.trim();
  const instagram = $("aud-instagram").value.trim();
  err.textContent = "";
  if (!nombre) { err.textContent = "Dime tu nombre para personalizar el plan."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Revisa tu correo, parece que falta algo."; return; }
  if (!$("aud-acepto").checked) { err.textContent = "Necesito que aceptes la política de privacidad para enviártelo."; return; }
  if ($("aud-web").value) return; // bot

  const btn = $("aud-enviar");
  btn.disabled = true; btn.textContent = "Enviando…";
  const marcados = Object.keys(estado.marcados).filter(k=>estado.marcados[k]);
  const datos = { nombre, email, instagram, marcados, opcion: estado.opcion || "", origen: "blog" };
  try {
    await fetch(ENDPOINT, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: JSON.stringify(datos) });
    estado.enviado = true; guardar();
    $("aud-formbox").classList.add("enviado");
  } catch(_) {
    err.textContent = "No se ha podido enviar. Revisa tu conexión e inténtalo otra vez.";
  }
  btn.disabled = false; btn.textContent = "Envíame mi plan";
});

$("aud-reset").addEventListener("click", ()=>{
  if (!confirm("¿Borrar todo y empezar de nuevo?")) return;
  estado = { marcados:{}, opcion:null, enviado:false }; guardar(); render(); actualizar();
  $("auditoria").scrollIntoView({behavior:"smooth"});
});

render(); actualizar();
})();
