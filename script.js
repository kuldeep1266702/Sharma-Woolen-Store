// ---------------- SHOP CONFIG ----------------
// Replace this number with the seller's WhatsApp number in international format.
// Example for India: 919876543210 (no +, spaces or dashes).
const SELLER_WHATSAPP = "918650271942";

const products = [
  {id:1,name:"Pink Baby Star Kit",cat:"baby",price:999,tag:"BESTSELLER",desc:"Soft hand-stitched newborn set.",image:"assets/baby-kit.jpg"},
  {id:2,name:"Rosebud Baby Cap",cat:"cap",price:299,tag:"NEW",desc:"Warm rib-knit cap for little ones.",icon:"🧢"},
  {id:3,name:"Tiny Cozy Socks",cat:"socks",price:249,tag:"POPULAR",desc:"Soft woollen socks for cosy feet.",icon:"🧦"},
  {id:4,name:"Petal Mittens",cat:"gloves",price:279,tag:"HANDMADE",desc:"Cute warm mittens with gentle stretch.",icon:"🧤"},
  {id:5,name:"Little Snow Sweater",cat:"sweater",price:699,tag:"NEW",desc:"Chunky hand-stitched winter sweater.",icon:"🧶"},
  {id:6,name:"Butterfly Baby Cap",cat:"cap",price:329,tag:"DESIGN",desc:"Playful cap with a sweet finish.",icon:"👒"},
  {id:7,name:"Cloudy White Socks",cat:"socks",price:269,tag:"SOFT",desc:"Classic woollen socks for everyday wear.",icon:"🧦"},
  {id:8,name:"Blush Knit Sweater",cat:"sweater",price:799,tag:"PREMIUM",desc:"Warm textured sweater in a soft blush tone.",icon:"🧶"},
  {id:9,name:"Cozy Rose Gloves",cat:"gloves",price:299,tag:"POPULAR",desc:"Warm gloves for chilly mornings.",icon:"🧤"},
  {id:10,name:"Blue Baby Gift Kit",cat:"baby",price:1099,tag:"GIFT SET",desc:"A sweet winter gift set for newborns.",icon:"🎁"}
];

let cart = JSON.parse(localStorage.getItem("woolwarmth_cart") || "[]");

const $ = s => document.querySelector(s);
const money = n => "₹" + n.toLocaleString("en-IN");

function renderProducts(filter="all"){
  const list = filter==="all" ? products : products.filter(p=>p.cat===filter);
  $("#resultText").textContent = `Showing ${list.length} product${list.length!==1?"s":""}`;
  $("#productGrid").innerHTML = list.map(p=>`
    <article class="product">
      <div class="product-visual">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div class="art">${p.icon}</div>`}
        <span class="badge">${p.tag}</span>
      </div>
      <div class="product-info">
        <small>${p.cat}</small><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Add +</button></div>
      </div>
    </article>`).join("");
}

function saveCart(){ localStorage.setItem("woolwarmth_cart",JSON.stringify(cart)); renderCart(); }
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item) item.qty++; else cart.push({id,qty:1});
  saveCart(); openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}

function cartDetails(){
  return cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty})).filter(Boolean);
}
function cartTotal(){return cartDetails().reduce((s,p)=>s+p.price*p.qty,0)}
function renderCart(){
  const items=cartDetails();
  $("#cartCount").textContent=items.reduce((s,p)=>s+p.qty,0);
  $("#cartTotal").textContent=money(cartTotal());
  $("#reviewItems").textContent=items.reduce((s,p)=>s+p.qty,0);
  $("#reviewTotal").textContent=money(cartTotal());
  $("#cartEmpty").style.display=items.length?"none":"flex";
  $("#cartItems").innerHTML=items.map(p=>`
    <div class="cart-row">
      ${p.image?`<img src="${p.image}" alt="">`:`<div class="mini-art">${p.icon}</div>`}
      <div><h4>${p.name}</h4><small>${money(p.price)} each</small>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${p.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div>
      </div>
      <div><b>${money(p.price*p.qty)}</b><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>
    </div>`).join("");
}

function openCart(){$("#cartDrawer").classList.add("open");$("#backdrop").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#backdrop").classList.remove("show")}
function openCheckout(){
  if(!cart.length){alert("Please add at least one product to your cart.");return}
  closeCart();$("#checkoutBackdrop").classList.add("show");renderCart();
}
function closeCheckout(){$("#checkoutBackdrop").classList.remove("show")}

function createOrderId(){
  return "WW" + new Date().toISOString().slice(0,10).replaceAll("-","") + "-" + Math.floor(1000+Math.random()*9000);
}

function makeWhatsAppMessage(data, orderId){
  const lines=cartDetails().map(p=>`• ${p.name} × ${p.qty} = ${money(p.price*p.qty)}`);
  return `Hello Wool & Warmth 👋

I want to place a Cash on Delivery order.

Order ID: ${orderId}

${lines.join("\n")}

Subtotal: ${money(cartTotal())}

CUSTOMER DETAILS
Name: ${data.name}
Mobile: ${data.phone}
Address: ${data.address}
City: ${data.city}
PIN: ${data.pin}
${data.note?`Note: ${data.note}\n`:""}
Please confirm availability, shipping charges and COD delivery. Thank you! 🧶`;
}

$("#cartBtn").onclick=openCart;
$("#closeCart").onclick=closeCart;
$("#backdrop").onclick=closeCart;
$("#checkoutBtn").onclick=openCheckout;
$("#closeCheckout").onclick=closeCheckout;
$("#checkoutBackdrop").addEventListener("click",e=>{if(e.target.id==="checkoutBackdrop")closeCheckout()});

document.querySelectorAll(".cat").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".cat").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");renderProducts(btn.dataset.filter);
}));

$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length)return;
  const data=Object.fromEntries(new FormData(e.target).entries());
  if(!/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g,""))){alert("Please enter a valid 10-digit Indian mobile number.");return}
  if(!/^\d{6}$/.test(data.pin)){alert("Please enter a valid 6-digit PIN code.");return}
  const orderId=createOrderId();
  const order={orderId,createdAt:new Date().toISOString(),items:cartDetails(),total:cartTotal(),customer:data};
  localStorage.setItem("woolwarmth_last_order",JSON.stringify(order));

  const text=encodeURIComponent(makeWhatsAppMessage(data,orderId));
  const phone=SELLER_WHATSAPP.replace(/\D/g,"");
  if(phone.includes("X") || phone.length<10){
    alert("Seller WhatsApp number is not configured yet. Open script.js and replace SELLER_WHATSAPP with the seller's number.");
    return;
  }
  window.open(`https://wa.me/${phone}?text=${text}`,"_blank");
  closeCheckout();
  cart=[];
  saveCart();
  $("#successText").textContent=`Order ${orderId} created. WhatsApp is opening.`;
  $("#successToast").classList.add("show");
  setTimeout(()=>$("#successToast").classList.remove("show"),6000);
});

function scrollToHow(){document.querySelector("#how").scrollIntoView({behavior:"smooth"})}
renderProducts();
renderCart();
