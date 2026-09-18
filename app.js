const products = [
  {id:1, name:"Premium Headphones", price:2999, img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", cat:"Electronics"},
  {id:2, name:"Classic Watch", price:4999, img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", cat:"Accessories"},
  {id:3, name:"Running Shoes", price:3499, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", cat:"Footwear"},
  {id:4, name:"Leather Bag", price:2599, img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400", cat:"Accessories"},
  {id:5, name:"Smart Speaker", price:1999, img:"https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400", cat:"Electronics"},
  {id:6, name:"Sunglasses", price:1299, img:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", cat:"Accessories"}
];

let cart = JSON.parse(localStorage.getItem('thiraCart')) || [];

const app = document.getElementById('app');

function saveCart(){ localStorage.setItem('thiraCart', JSON.stringify(cart)); updateNavCount(); }
function updateNavCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const cartLink = document.querySelector('[data-route="cart"]');
  if(cartLink) cartLink.textContent = `Cart (${count})`;
}

function renderHome(){
  app.innerHTML = `
  <section class="hero">
    <h1>Premium Collection 2026</h1>
    <p>Built by Yabaluri Vyshnavi | Thiranex Capstone Project</p>
    <a href="#/shop" class="btn">Shop Now</a>
  </section>
  <section class="featured"><h2>Featured</h2><div class="grid">${products.slice(0,3).map(p=>productCard(p)).join('')}</div></section>`;
}

function productCard(p){
  return `<div class="card">
    <img src="${p.img}"><span class="cat">${p.cat}</span>
    <h3>${p.name}</h3><p class="price">₹${p.price}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  </div>`;
}

function renderShop(){
  app.innerHTML = `<h2 class="page-title">Shop All Products</h2><div class="grid">${products.map(p=>productCard(p)).join('')}</div>`;
}

function renderCart(){
  if(cart.length===0){ app.innerHTML = `<div class="empty-cart"><h2>Your Cart is Empty</h2><a href="#/shop" class="btn">Continue Shopping</a></div>`; return;}
  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  app.innerHTML = `<h2 class="page-title">Your Cart</h2>
  <div class="cart-list">${cart.map(i=>`
    <div class="cart-item"><img src="${i.img}"><div><h4>${i.name}</h4><p>₹${i.price} x ${i.qty}</p></div>
    <div><button onclick="changeQty(${i.id},-1)">-</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button>
    <button class="remove" onclick="removeItem(${i.id})">Remove</button></div></div>`).join('')}
  </div><div class="total"><h3>Total: ₹${total}</h3><button class="btn" onclick="checkout()">Checkout</button></div>`;
}

window.addToCart = (id)=>{ const p=products.find(x=>x.id===id); const f=cart.find(x=>x.id===id); if(f)f.qty++; else cart.push({...p,qty:1}); saveCart(); alert(p.name+" added!"); }
window.changeQty = (id,d)=>{ const f=cart.find(x=>x.id===id); if(!f)return; f.qty+=d; if(f.qty<=0)cart=cart.filter(x=>x.id!==id); saveCart(); renderCart(); }
window.removeItem = (id)=>{ cart=cart.filter(x=>x.id!==id); saveCart(); renderCart(); }
window.checkout = ()=>{ alert("Order Placed Successfully! 🎉 Total: ₹"+cart.reduce((s,i)=>s+i.price*i.qty,0)); cart=[]; saveCart(); location.hash="#/home"; }

function router(){
  const route = location.hash || "#/home";
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const active = document.querySelector(`[data-route="${route.replace('#/','')}"]`); if(active)active.classList.add('active');
  if(route==="#/shop")renderShop(); else if(route==="#/cart")renderCart(); else renderHome();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', ()=>{ router(); updateNavCount(); });