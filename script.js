const defaultPins=[12,13,15];

function log(msg){console.log(msg);}
function buildUrl(ip,pin,state){return `http://${ip}/led${pin-11}`;}
async function sendCommand(pin,state){
  const ip=document.getElementById('espIp').value.trim();
  const url=buildUrl(ip,pin,state);
  try{
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`state=${state}`});
    const text=await res.text();
    log(`-> ${url} [HTTP ${res.status}] ${text}`);
    return {ok:res.ok,text};
  }catch(err){log('ERROR '+err);return {ok:false,text:err};}
}

function renderOutputs(){
  const container=document.getElementById('outputs');
  container.innerHTML='';
  defaultPins.forEach(pin=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`<span>PIN ${pin}</span><button id="btn-${pin}">Toggle</button>`;
    container.appendChild(el);
    const btn=document.getElementById(`btn-${pin}`);
    btn.onclick=async ()=>{
      btn.disabled=true;
      const newState=btn.textContent.includes('ON')? 'off':'on';
      const r=await sendCommand(pin,newState);
      if(r.ok) btn.textContent='Toggle '+newState.toUpperCase();
      btn.disabled=false;
    };
  });
}

document.getElementById('btnPing').addEventListener('click',async ()=>{
  const ip=document.getElementById('espIp').value.trim();
  try{
    const r=await fetch(`http://${ip}/status`);
    if(r.ok){
      document.getElementById('connStatus').textContent='✅ Conectado';
      document.getElementById('connStatus').className='status on';
    } else {
      document.getElementById('connStatus').textContent='❌ Sin conexión';
      document.getElementById('connStatus').className='status off';
    }
  }catch(e){
    document.getElementById('connStatus').textContent='❌ Sin conexión';
    document.getElementById('connStatus').className='status off';
  }
});

renderOutputs();