import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ShoppingBag, Search, ArrowRight, Lock, 
  Layers, Droplet, Truck, RefreshCw, RotateCcw, Plus, Instagram, Youtube,
  ChevronLeft, ChevronRight, Type, Image as ImageIcon, Upload, Star, ShieldCheck, Undo2
} from 'lucide-react';

// --- DATA ---
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
    title: "Essentials",
    subtitle: "Refined"
  },
  {
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200",
    title: "Architecture",
    subtitle: "Pure"
  },
  {
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200",
    title: "Silhouettes",
    subtitle: "Modern"
  }
];

const PRODUCTS = [
  { id: 1, name: "Sand Heavyweight", price: 1299, category: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", description: "A structured silhouette engineered from 320 GSM Supima cotton. Features reinforced double-needle stitching and a pre-shrunk finish for architectural longevity." },
  { id: 2, name: "Urban Box Tee", price: 1599, category: "Streetwear", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", description: "Dropped shoulders and a wider chest profile define this boxy streetwear staple. Made for movement without sacrificing the heavy-weight feel." },
  { id: 3, name: "Washed Graphite", price: 1899, category: "Premium", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800", description: "Each piece is garment-dyed and ozone-washed to achieve a unique vintage patina. The ultimate premium neutral for sophisticated layering." },
  { id: 4, name: "Organic Clay", price: 1499, category: "Sustainable", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800", description: "100% GOTS-certified organic cotton dyed with low-impact earth pigments. Sustainable engineering meets industrial aesthetic." },
  { id: 5, name: "Bone White Core", price: 1199, category: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", description: "The essential foundation of the Classic Prints archive. Optical white finish on high-density knit for a crisp, professional drape." },
  { id: 6, name: "Oversized Moss", price: 1699, category: "Streetwear", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800", description: "A deep olive tone inspired by forest architecture. Built with an exaggerated fit that retains its shape wash after wash." },
  { id: 7, name: "Desert Sand Tee", price: 1499, category: "Premium", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800", description: "Lightweight yet durable. A breathable 280 GSM alternative for warmer climates that still offers the signature heavy-weight silhouette." },
  { id: 8, name: "Midnight Umber", price: 1999, category: "Premium", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800", description: "The apex of our dyeing laboratory. A complex, dark umber that appears different under various lighting conditions. Truly unique." }
];

export default function App() {
  // --- STATE ---
  const [view, setView] = useState('home'); // 'home' or 'product-detail'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  
  // Custom Workshop State
  const [labConfig, setLabConfig] = useState({
    type: 'text',
    text: "CLASSIC",
    font: "Inter",
    color: "#1e1e1e",
    fontSize: 32,
    customImage: null,
    posX: 0,
    posY: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // --- HERO CAROUSEL LOGIC ---
  useEffect(() => {
    if (view === 'home') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [view]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // --- ACTIONS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLabConfig(prev => ({ ...prev, customImage: event.target.result, type: 'image' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addToCart = (product, isCustom = false) => {
    const cartId = isCustom ? `custom-${Date.now()}` : `${product.id}-${selectedSize}`;
    const newItem = {
      ...product,
      cartId,
      qty: 1,
      size: selectedSize,
      isCustom,
      config: isCustom ? { ...labConfig } : null
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedSize('M');
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQty = (cartId, delta) => {
    setCart(cart.map(item => item.cartId === cartId ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

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
    
    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;
    
    setLabConfig(prev => ({ 
      ...prev, 
      posX: Math.max(-100, Math.min(100, newX)), 
      posY: Math.max(-140, Math.min(140, newY)) 
    }));
  };

  useEffect(() => {
    if (isDragging) {
      const stopDragging = () => setIsDragging(false);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', stopDragging);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', stopDragging);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', stopDragging);
      };
    }
  }, [isDragging]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal + (subtotal * 0.18);

  return (
    <div className="bg-[#f5f2eb] text-[#1e1e1e] min-h-screen selection:bg-[#1e1e1e] selection:text-[#f5f2eb]">
      {/* Announcement */}
      <div className="bg-[#1e1e1e] text-[#f5f2eb] py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] z-[60] relative">
        Free Express Delivery on Orders Over ₹2,500 • Neutral Season Drops Now Live
      </div>

      {/* Nav */}
      <nav className="sticky top-0 w-full bg-[#fdfcf8]/70 backdrop-blur-xl z-50 border-b border-[#e5e1d8]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 
            onClick={() => setView('home')} 
            className="text-2xl font-black uppercase italic tracking-tighter cursor-pointer group"
          >
            Classic<span className="text-stone-500 group-hover:text-stone-800 transition-colors">Prints</span>
          </h1>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-stone-500">
            <button onClick={() => setView('home')} className="hover:text-[#1e1e1e] transition-colors">Shop All</button>
            <a href="#customlab" onClick={() => setView('home')} className="hover:text-[#1e1e1e] transition-colors">Custom Lab</a>
            <button onClick={() => setView('home')} className="hover:text-[#1e1e1e] transition-colors">Process</button>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="p-2.5 bg-[#1e1e1e] text-[#f5f2eb] rounded-full relative hover:scale-105 transition-transform">
            <ShoppingBag size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {view === 'home' ? (
        <>
          {/* Hero */}
          <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-7 space-y-8 z-20">
                <h1 className="text-6xl md:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase italic">
                  {HERO_SLIDES[currentSlide].title}<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '1px #1e1e1e' }}>{HERO_SLIDES[currentSlide].subtitle}</span><br />
                  Daily.
                </h1>
                <p className="text-stone-500 text-lg max-w-md font-medium">Engineered with 320 GSM heavy-weight Supima cotton. Architectural apparel for the modern mind.</p>
                <div className="flex gap-4">
                  <a href="#shopall" className="bg-[#1e1e1e] text-[#f5f2eb] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group shadow-xl">
                    Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
              
              <div className="lg:col-span-5 relative h-[500px] md:h-[600px]">
                {HERO_SLIDES.map((slide, index) => (
                  <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.image} className="w-full h-full object-cover rounded-[3rem] shadow-2xl" alt="" />
                  </div>
                ))}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
                  <button onClick={prevSlide} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"><ChevronLeft size={20} /></button>
                  <button onClick={nextSlide} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"><ChevronRight size={20} /></button>
                </div>
              </div>
            </div>
          </section>

          {/* Custom Workshop Page */}
          {/* <section id="customlab" className="py-24 bg-[#1e1e1e] text-[#f5f2eb] px-6 overflow-hidden">
            <div className="max-w-[1440px] mx-auto">
              <div className="grid lg:grid-cols-10 gap-16 items-start">
                <div className="lg:col-span-3 space-y-12">
                  <div>
                    <span className="text-stone-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">The Studio</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-tight mb-8">Design<br/>Station.</h2>
                    <div className="flex gap-2 p-1 bg-stone-900 rounded-2xl w-full mb-10">
                      <button 
                        onClick={() => setLabConfig({...labConfig, type: 'text'})}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${labConfig.type === 'text' ? 'bg-stone-800 text-white shadow-lg' : 'text-stone-500'}`}
                      >
                        <Type size={16} /> Typography
                      </button>
                      <button 
                        onClick={() => setLabConfig({...labConfig, type: 'image'})}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${labConfig.type === 'image' ? 'bg-stone-800 text-white shadow-lg' : 'text-stone-500'}`}
                      >
                        <ImageIcon size={16} /> Upload Design
                      </button>
                    </div>
                  </div>

                  <div className="space-y-10 min-h-[400px]">
                    {labConfig.type === 'text' ? (
                      <div className="space-y-8 animate-fadeIn">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-600">Statement Text</label>
                          <input 
                            type="text" 
                            value={labConfig.text}
                            onChange={(e) => setLabConfig({...labConfig, text: e.target.value.toUpperCase()})}
                            className="w-full bg-stone-900 p-5 rounded-2xl border-2 border-white/5 focus:border-stone-400 outline-none font-black text-xl uppercase placeholder:text-stone-800"
                            placeholder="ENTER STATEMENT"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-600">Font Style</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Inter', 'Space Grotesk', 'serif'].map(f => (
                              <button 
                                key={f} 
                                onClick={() => setLabConfig({...labConfig, font: f})}
                                className={`py-4 border-2 rounded-xl text-[10px] font-black uppercase ${labConfig.font === f ? 'border-stone-400 text-white' : 'border-white/5 text-stone-600'}`}
                              >
                                {f === 'serif' ? 'Classic' : f.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-fadeIn">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-stone-600">Upload Asset</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 bg-stone-900 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-stone-400 transition-all group"
                          >
                            {labConfig.customImage ? (
                              <div className="relative group">
                                <img src={labConfig.customImage} className="w-24 h-24 object-contain rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <RefreshCw size={24} className="text-white" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Upload size={24} className="text-stone-400" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">PNG / JPG (MAX 5MB)</p>
                              </>
                            )}
                          </div>
                          <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-600 flex justify-between">
                          Design Scale <span>{labConfig.fontSize}px</span>
                        </label>
                        <input 
                          type="range" min="10" max="100" 
                          value={labConfig.fontSize}
                          onChange={(e) => setLabConfig({...labConfig, fontSize: parseInt(e.target.value)})}
                          className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-stone-400" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-600">Fabric Shade</label>
                        <div className="flex gap-4">
                          {['#1e1e1e', '#4a4a4a', '#f5f2eb', '#d6cfc7'].map(c => (
                            <button 
                              key={c} 
                              onClick={() => setLabConfig({...labConfig, color: c})}
                              style={{ backgroundColor: c }}
                              className={`w-10 h-10 rounded-full border-4 ${labConfig.color === c ? 'border-stone-500 scale-110' : 'border-transparent opacity-40 hover:opacity-100'} transition-all shadow-xl`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">Premium Flat Rate</span>
                      <p className="text-4xl font-black italic tracking-tighter leading-none">₹2,499</p>
                    </div>
                    <button 
                      onClick={() => addToCart({ name: "Lab Custom Tee", price: 2499, category: "Custom", id: Date.now() }, true)}
                      className="w-full bg-[#f5f2eb] text-[#1e1e1e] py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      Craft My Tee <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 flex items-center justify-center min-h-[700px] relative">
                  <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center p-12">
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <div 
                        className="w-full h-full bg-contain bg-center bg-no-repeat transition-colors duration-700 rounded-[4rem]"
                        style={{ 
                          backgroundImage: 'url("https://www.transparenttextures.com/patterns/fabric-plaid.png")',
                          backgroundColor: labConfig.color,
                          maskImage: 'url("https://images.squarespace-cdn.com/content/v1/5941865c6b8f5bc6a2651475/1532025736630-T1019X8B7T4F7W9R8R0D/T-shirt-Template.png?format=1000w")',
                          WebkitMaskImage: 'url("https://images.squarespace-cdn.com/content/v1/5941865c6b8f5bc6a2651475/1532025736630-T1019X8B7T4F7W9R8R0D/T-shirt-Template.png?format=1000w")',
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat'
                        }}
                      />
                    </div>

                    <div className="relative w-72 h-96 border border-white/5 z-10 flex items-center justify-center group">
                      {labConfig.type === 'text' ? (
                        <span 
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleMouseDown}
                          style={{ 
                            fontFamily: labConfig.font, 
                            fontSize: `${labConfig.fontSize}px`,
                            transform: `translate(${labConfig.posX}px, ${labConfig.posY}px)`,
                            color: (labConfig.color === '#f5f2eb' || labConfig.color === '#d6cfc7') ? '#1e1e1e' : '#f5f2eb'
                          }}
                          className="font-black uppercase tracking-tighter italic cursor-move select-none absolute text-center whitespace-pre leading-[0.9] drop-shadow-lg"
                        >
                          {labConfig.text || "PREVIEW"}
                        </span>
                      ) : (
                        <div
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleMouseDown}
                          style={{ 
                            transform: `translate(${labConfig.posX}px, ${labConfig.posY}px)`,
                            width: `${labConfig.fontSize * 4}px`
                          }}
                          className="cursor-move select-none absolute"
                        >
                          {labConfig.customImage ? (
                            <img src={labConfig.customImage} className="w-full h-auto pointer-events-none drop-shadow-2xl" alt="" />
                          ) : (
                            <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-stone-700 opacity-20">Waiting for Upload</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Shop Section */}
          <section id="shopall" className="py-32 px-6 bg-[#fdfcf8]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">The Gallery.</h2>
                <div className="flex gap-2">
                  {["All", "Essentials", "Streetwear", "Premium"].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#1e1e1e] text-white shadow-lg' : 'bg-[#ece9e0] text-stone-500 hover:bg-stone-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory).map(product => (
                  <div key={product.id} className="group cursor-pointer animate-fadeIn" onClick={() => openProductDetail(product)}>
                    <div className="aspect-[3/4] bg-[#ece9e0] rounded-[2rem] overflow-hidden mb-6 relative">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                         <span className="bg-white px-8 py-4 rounded-xl font-black text-[10px] uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">View Details</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start px-2">
                      <div>
                        <h3 className="font-black text-sm uppercase italic tracking-tighter">{product.name}</h3>
                        <p className="text-[10px] text-stone-400 font-bold uppercase mt-1 tracking-widest">{product.category}</p>
                      </div>
                      <span className="font-black text-lg text-stone-500">₹{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-32 bg-[#f5f2eb] border-y border-[#e5e1d8] px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-[#ece9e0] text-[#1e1e1e] rounded-2xl flex items-center justify-center"><Layers size={24} /></div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Supima 320 GSM</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Extra-long staple cotton grown sustainably for unmatched softness and structural integrity.</p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 bg-[#1e1e1e] text-[#f5f2eb] rounded-2xl flex items-center justify-center"><Droplet size={24} /></div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Industrial Dye</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Garment-dyed reactive process ensures deep saturation and color that evolves but never fades.</p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 bg-stone-400 text-white rounded-2xl flex items-center justify-center"><Truck size={24} /></div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Plastic Neutral</h3>
                <p className="text-stone-500 text-sm leading-relaxed">All shipping materials are 100% compostable. Better for the silhouette, better for the planet.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* PRODUCT DETAIL PAGE */
        <section className="min-h-screen py-20 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => setView('home')} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors mb-12"
            >
              <Undo2 size={14} /> Back to Gallery
            </button>

            <div className="grid lg:grid-cols-12 gap-16 items-start">
              {/* Left: Product Image */}
              <div className="lg:col-span-7">
                <div className="aspect-[4/5] bg-[#ece9e0] rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                </div>
              </div>

              {/* Right: Info */}
              <div className="lg:col-span-5 space-y-12">
                <div className="space-y-4">
                  <span className="text-stone-400 font-black uppercase text-[10px] tracking-[0.4em]">{selectedProduct.category} Collection</span>
                  <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">{selectedProduct.name}</h1>
                  <div className="flex items-center gap-4 pt-2">
                    <p className="text-3xl font-black text-stone-900 font-space">₹{selectedProduct.price}</p>
                    <div className="flex items-center bg-stone-200 px-3 py-1 rounded-full gap-1">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase">4.9 Rare Drop</span>
                    </div>
                  </div>
                </div>

                <p className="text-stone-500 text-lg leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-600 block mb-4">Select Silhouette Size</label>
                    <div className="flex gap-3">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 border-2 rounded-2xl font-black text-sm flex items-center justify-center transition-all ${selectedSize === size ? 'bg-[#1e1e1e] text-white border-[#1e1e1e] scale-110 shadow-lg' : 'border-stone-200 text-stone-400 hover:border-stone-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full bg-[#1e1e1e] text-[#f5f2eb] py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95"
                  >
                    Add to Bag <ShoppingBag size={18} />
                  </button>
                </div>

                <div className="pt-10 border-t border-stone-200 grid grid-cols-2 gap-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-stone-400"><ShieldCheck size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Quality Guaranteed</p>
                      <p className="text-[10px] text-stone-400 font-bold">Industrial Standard</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-stone-400"><Truck size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Express Shipping</p>
                      <p className="text-[10px] text-stone-400 font-bold">2-4 Business Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#1e1e1e] text-[#f5f2eb] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              {/* <h1 className="text-4xl font-black uppercase italic tracking-tighter">Classic<span className="text-stone-500">Prints</span></h1> */}
              <img src="/Logo.png" alt="Classic Prints" className="block w-48 h-auto object-contain" />
              <p className="-mt-8 text-stone-500 max-w-sm text-sm leading-relaxed font-medium italic">Redefining the standard of basic apparel through meticulous engineering and organic neutral aesthetics.</p>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors"><Instagram size={20} /></button>
                <button className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors"><Youtube size={20} /></button>
              </div>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.4em] mb-8 text-stone-600">Archive</h4>
              <ul className="space-y-4 font-bold uppercase text-[11px] tracking-widest text-stone-400">
                <li><button onClick={() => setView('home')} className="hover:text-white">Shop All</button></li>
                <li><a href="#customlab" onClick={() => setView('home')} className="hover:text-white">Custom Lab</a></li>
                <li><button onClick={() => setView('home')} className="hover:text-white">Our Process</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.4em] mb-8 text-stone-600">Newsletter</h4>
              <div className="relative">
                <input type="email" placeholder="Email address" className="w-full bg-stone-900 border-none p-4 pr-12 rounded-xl text-xs font-bold focus:ring-1 focus:ring-stone-400 outline-none text-white" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-stone-700">
            <p>© 2024 Classic Prints. India.</p>
            <div className="flex gap-8"><span>Privacy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#fdfcf8] h-full flex flex-col shadow-2xl animate-slideLeft">
            <div className="p-8 border-b border-[#e5e1d8] flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your Bag <span className="text-stone-400">({cart.length})</span></h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-6 items-start animate-fadeIn">
                  <div className={`w-24 h-28 ${item.isCustom ? 'bg-stone-950' : 'bg-[#ece9e0]'} rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center p-2 border border-black/5 shadow-sm`}>
                    {item.isCustom ? (
                       item.config.type === 'text' ? (
                        <span className="text-[6px] text-white font-black uppercase text-center opacity-40">{item.config.text}</span>
                       ) : (
                        <img src={item.config.customImage} className="w-full h-full object-contain opacity-40" alt="" />
                       )
                    ) : (
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between font-black uppercase text-sm italic tracking-tighter">
                      <span>{item.name}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Size: {item.size}</p>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center bg-[#ece9e0] rounded-xl px-2">
                        <button onClick={() => updateQty(item.cartId, -1)} className="p-1 px-2 font-bold">-</button>
                        <span className="px-3 font-black text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(item.cartId, 1)} className="p-1 px-2 font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-[9px] font-black uppercase text-red-400 hover:text-red-500">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-[#e5e1d8] bg-[#f5f2eb] space-y-4 shadow-t-xl">
                <div className="flex justify-between font-black uppercase tracking-tighter text-xl">
                  <span>Total Due</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <button className="w-full bg-[#1e1e1e] text-[#f5f2eb] py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-2xl shadow-black/10">
                  Secure Checkout <Lock size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}