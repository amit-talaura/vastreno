import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ShoppingBag, Search, ArrowRight, Lock, 
  Layers, Droplet, Truck, RefreshCw, RotateCcw, Plus, Instagram, Youtube 
} from 'lucide-react';

// --- DATA ---
const PRODUCTS = [
  { id: 1, name: "Sand Heavyweight", price: 1299, category: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Urban Box Tee", price: 1599, category: "Streetwear", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Washed Graphite", price: 1899, category: "Premium", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Organic Clay", price: 1499, category: "Sustainable", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Bone White Core", price: 1199, category: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
  { id: 6, name: "Oversized Moss", price: 1699, category: "Streetwear", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800" },
  { id: 7, name: "Desert Sand Tee", price: 1499, category: "Premium", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800" },
  { id: 8, name: "Midnight Umber", price: 1999, category: "Premium", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800" }
];

const MARKETPLACES = [
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", url: "#" },
  { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png", url: "#" },
  { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Flipkart_logo.png", url: "#" }
];

export default function App() {
  // --- STATE ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  
  // Lab State
  const [labConfig, setLabConfig] = useState({
    text: "CLASSIC",
    font: "Inter",
    color: "#1e1e1e",
    fontSize: 32,
    posX: 0,
    posY: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // --- ACTIONS ---
  const addToCart = (product, isCustom = false) => {
    const cartId = isCustom ? `custom-${Date.now()}` : `${product.id}-${selectedSize}`;
    const existing = cart.find(item => item.cartId === cartId);

    if (existing && !isCustom) {
      setCart(cart.map(item => item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item));
    } else {
      const newItem = {
        ...product,
        cartId,
        qty: 1,
        size: selectedSize,
        isCustom,
        config: isCustom ? { ...labConfig } : null
      };
      setCart([...cart, newItem]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (cartId, delta) => {
    setCart(cart.map(item => 
      item.cartId === cartId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // --- DRAG LOGIC ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - labConfig.posX, y: clientY - labConfig.posY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    // Simple boundary clamping
    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;
    setLabConfig(prev => ({ ...prev, posX: Math.max(-80, Math.min(80, newX)), posY: Math.max(-100, Math.min(100, newY)) }));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="bg-[#f5f2eb] text-[#1e1e1e] min-h-screen selection:bg-[#1e1e1e] selection:text-[#f5f2eb]">
      {/* Announcement */}
      <div className="bg-[#1e1e1e] text-[#f5f2eb] py-2 text-center text-[10px] font-black uppercase tracking-[0.3em]">
        Free Express Delivery on Orders Over ₹2,500 • The Neutral Collection Out Now
      </div>

      {/* Nav */}
      <nav className="sticky top-0 w-full bg-[#fdfcf8]/70 backdrop-blur-xl z-50 border-b border-[#e5e1d8]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Classic<span className="text-stone-500">Prints</span>
          </h1>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-stone-500">
            {["Shop All", "Custom Lab", "Process", "Find Us"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-[#1e1e1e] transition-colors">{item}</a>
            ))}
          </div>
          <button onClick={() => setIsCartOpen(true)} className="p-2.5 bg-[#1e1e1e] text-[#f5f2eb] rounded-full relative">
            <ShoppingBag size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-6xl md:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase italic">
              Essentials<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px #1e1e1e' }}>Refined</span><br />
              Daily.
            </h1>
            <p className="text-stone-500 text-lg max-w-md">Engineered with 320 GSM heavy-weight Supima cotton. Architecture for the body.</p>
            <div className="flex gap-4">
              <button className="bg-[#1e1e1e] text-[#f5f2eb] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group">
                Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-[500px]">
             <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-[3rem] shadow-2xl" alt="Hero" />
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shopall" className="py-24 px-6 bg-[#fdfcf8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Latest Drops</h2>
            <div className="flex gap-2">
              {["All", "Essentials", "Streetwear", "Premium"].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#1e1e1e] text-white' : 'bg-[#ece9e0] text-stone-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory).map(product => (
              <div key={product.id} className="group cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                <div className="aspect-[3/4] bg-[#ece9e0] rounded-3xl overflow-hidden mb-4 relative">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">Quick Add</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-sm uppercase italic tracking-tighter">{product.name}</h3>
                  <span className="font-black text-stone-500">₹{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Lab */}
      <section id="customlab" className="py-32 bg-[#1e1e1e] text-[#f5f2eb] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-[450px] bg-stone-900 rounded-[3rem] overflow-hidden flex items-center justify-center border border-white/5">
               <div className="w-48 h-64 border-2 border-white/5 relative flex items-center justify-center pointer-events-none">
                  <span 
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    style={{ 
                      fontFamily: labConfig.font, 
                      fontSize: labConfig.fontSize,
                      transform: `translate(${labConfig.posX}px, ${labConfig.posY}px)`,
                      color: labConfig.color === '#f5f2eb' ? '#1e1e1e' : '#f5f2eb',
                      pointerEvents: 'auto'
                    }}
                    className="font-black uppercase tracking-tighter italic cursor-move absolute"
                  >
                    {labConfig.text || "DESIGN"}
                  </span>
               </div>
            </div>
          </div>
          <div className="space-y-10">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Custom Workshop</h2>
            <div className="space-y-6">
              <input 
                type="text" 
                value={labConfig.text}
                onChange={(e) => setLabConfig({...labConfig, text: e.target.value.toUpperCase()})}
                className="w-full bg-stone-900 p-5 rounded-2xl border-2 border-white/5 focus:border-stone-400 outline-none font-black uppercase"
                placeholder="Enter Statement"
              />
              <div className="flex gap-4">
                {['Inter', 'Space Grotesk', 'serif'].map(f => (
                  <button key={f} onClick={() => setLabConfig({...labConfig, font: f})} className="w-12 h-12 border-2 border-stone-600 rounded-xl font-bold flex items-center justify-center">A</button>
                ))}
              </div>
              <button 
                onClick={() => addToCart({ name: "Custom Tee", price: 2499, image: "", category: "Custom", id: Date.now() }, true)}
                className="w-full bg-[#f5f2eb] text-[#1e1e1e] py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Craft My Tee
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] text-[#f5f2eb] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-8">
                Classic<span className="text-stone-500">Prints</span>
              </h1>
              <p className="text-stone-500 max-w-sm mb-8 leading-relaxed font-medium text-sm">
                Redefining the standard of basic apparel through meticulous engineering and organic neutral aesthetics. 100% Cotton. 100% Quality.
              </p>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors">
                  <Instagram size={20} />
                </button>
                <button className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors">
                  <Youtube size={20} />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-stone-600">Explore</h4>
              <ul className="space-y-4 font-bold uppercase text-[11px] tracking-widest text-stone-400">
                <li><a href="#shopall" className="hover:text-[#f5f2eb] transition-colors">Shop All</a></li>
                <li><a href="#customlab" className="hover:text-[#f5f2eb] transition-colors">Custom Lab</a></li>
                <li><a href="#" className="hover:text-[#f5f2eb] transition-colors">Our Process</a></li>
                <li><a href="#" className="hover:text-[#f5f2eb] transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8 text-stone-600">Newsletter</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-stone-900 border-none p-4 pr-12 rounded-xl text-xs font-bold focus:ring-2 focus:ring-stone-400 outline-none text-[#f5f2eb]"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#f5f2eb] transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
              <p className="text-[10px] text-stone-600 font-bold uppercase mt-4 tracking-wider">Join our community for early access drops.</p>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-stone-600">
            <p>© 2024 Classic Prints. Crafted for Excellence.</p>
            <div className="flex gap-8">
              <span className="cursor-pointer hover:text-stone-400 transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-stone-400 transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#fdfcf8] h-full flex flex-col shadow-2xl animate-slideLeft">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)}><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-4">
                  <div className="w-20 h-24 bg-[#ece9e0] rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.isCustom ? (
                      <div className="bg-stone-900 w-full h-full flex items-center justify-center p-2">
                        <span className="text-[6px] text-white font-black uppercase text-center">{item.config.text}</span>
                      </div>
                    ) : (
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-black uppercase text-sm italic tracking-tighter">
                      <span>{item.name}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                    {item.isCustom && <p className="text-[9px] font-bold text-stone-500 uppercase mt-1">"{item.config.text}" • {item.config.font}</p>}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-[#ece9e0] rounded-lg px-2">
                        <button onClick={() => updateQty(item.cartId, -1)} className="p-1 px-2 font-bold">-</button>
                        <span className="px-2 font-black text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId, 1)} className="p-1 px-2 font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-[10px] uppercase font-black text-stone-400">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 py-20">
                  <ShoppingBag size={48} className="opacity-20 mb-4" />
                  <p className="font-black uppercase tracking-widest text-[10px]">Your bag is empty</p>
                </div>
              )}
            </div>
            <div className="p-8 border-t bg-[#f5f2eb] space-y-4">
              <div className="flex justify-between font-black uppercase tracking-tighter text-xl">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button className="w-full bg-[#1e1e1e] text-[#f5f2eb] py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                Secure Checkout <Lock size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}