import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { Flame, Star, Coins, X, CheckCircle, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import LocationMap from '../components/LocationMap';
export default function Landing() {
  const { products, loading } = useProducts();
  const [cashbackBalance, setCashbackBalance] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedCashback, setEarnedCashback] = useState(0);
  const [useCashback, setUseCashback] = useState(false);

  useEffect(() => {
    const savedBalance = localStorage.getItem('cashbackBalance');
    if (savedBalance) {
      setCashbackBalance(parseFloat(savedBalance));
    }
  }, []);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter(i => i.product.id !== productId);
      }
      return prev.map(i => i.product.id === productId ? { ...i, quantity: newQuantity } : i);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const amountToPay = useCashback ? Math.max(0, cartTotal - cashbackBalance) : cartTotal;
  const potentialCashback = amountToPay * 0.10;

  const handleConfirmPurchase = () => {
    if (cart.length === 0) return;
    
    let newBalance = cashbackBalance;

    if (useCashback) {
      if (cashbackBalance >= cartTotal) {
        newBalance = cashbackBalance - cartTotal;
      } else {
        newBalance = 0;
      }
    }

    newBalance += potentialCashback;
    
    setEarnedCashback(potentialCashback);
    setCashbackBalance(newBalance);
    localStorage.setItem('cashbackBalance', newBalance.toString());
    setIsSuccess(true);
    setCart([]);
    setUseCashback(false);
  };

  const openCart = () => {
    setIsSuccess(false);
    setIsCartOpen(true);
  };

  const staticProducts = [
    {
      id: 'static-1',
      name: 'Elote Preparado',
      description: 'El clásico elote en palo con mayonesa, queso cotija, chilito y limón.',
      price: 35.0,
      imageUrl: '/elote_preparado.jpg',
      category: 'Elotes'
    },
    {
      id: 'static-2',
      name: 'Elote Sencillo',
      description: 'Elote tradicional hervido, calientito con mantequilla y sal.',
      price: 25.0,
      imageUrl: '/elote_sencillo.jpg',
      category: 'Elotes'
    },
    {
      id: 'static-3',
      name: 'Esquite Preparado',
      description: 'Vaso de esquites con caldito, mayonesa, queso, chilito del que pica y limón.',
      price: 45.0,
      imageUrl: '/esquite_preparado.jpg',
      category: 'Esquites'
    },
    {
      id: 'static-4',
      name: 'Esquite Sencillo',
      description: 'Vaso de esquites tradicionales solo con su juguito y limón.',
      price: 30.0,
      imageUrl: '/esquite_sencillo.jpg',
      category: 'Esquites'
    }
  ];

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <Flame color="#FF5A1F" size={32} />
            Elotes<span>Perrones</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFC107', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 'bold' }}>
              <Coins size={20} />
              <span>${cashbackBalance.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={openCart}
              style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ShoppingCart size={28} color="var(--color-text)" />
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <nav className="nav-links">
              <a href="#menu" className="nav-link">Menú</a>
              <a href="#about" className="nav-link">Nosotros</a>
              <Link to="/admin" className="btn btn-primary">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Los mejores esquites de la ciudad</h1>
            <p>Preparados con la receta secreta de la abuela, mucho chilito del que sí pica y un toque de amor perrón. ¡Gana 10% de cashback en todas tus compras!</p>
            <a href="#menu" className="btn btn-primary">Ver Menú <Star size={20} /></a>
          </div>
        </section>

        <section id="menu" className="product-section container">
          <h2 className="section-title">Nuestro Menú</h2>
          <div className="product-grid">
            {staticProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <span className="product-badge">{product.category}</span>
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {(() => {
                      const cartItem = cart.find(item => item.product.id === product.id);
                      if (cartItem) {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-icon" style={{ padding: '0.25rem', width: '32px', height: '32px' }} onClick={() => updateQuantity(product.id, -1)}>
                              <Minus size={16} />
                            </button>
                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                            <button className="btn btn-secondary btn-icon" style={{ padding: '0.25rem', width: '32px', height: '32px' }} onClick={() => updateQuantity(product.id, 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} title="Agregar al carrito" onClick={() => addToCart(product)}>
                          <Plus size={18} /> Agregar
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}

            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <span className="product-badge">{product.category}</span>
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {(() => {
                      const cartItem = cart.find(item => item.product.id === product.id);
                      if (cartItem) {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-icon" style={{ padding: '0.25rem', width: '32px', height: '32px' }} onClick={() => updateQuantity(product.id, -1)}>
                              <Minus size={16} />
                            </button>
                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                            <button className="btn btn-secondary btn-icon" style={{ padding: '0.25rem', width: '32px', height: '32px' }} onClick={() => updateQuantity(product.id, 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} title="Agregar al carrito" onClick={() => addToCart(product)}>
                          <Plus size={18} /> Agregar
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontSize: '1.25rem' }}>Cargando más de nuestro delicioso menú...</p>
            )}
          </div>
        </section>
        <LocationMap />
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
            
            {!isSuccess ? (
              <>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingCart size={28} /> Mi Carrito
                </h2>
                
                {cart.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-light)' }}>
                    Tu carrito está vacío. ¡Anímate a pedir unos esquites!
                  </p>
                ) : (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                      {cart.map((item) => (
                        <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0 }}>{item.product.name}</h4>
                            <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>${item.product.price.toFixed(2)} c/u</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => updateQuantity(item.product.id, -1)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <Minus size={16} />
                            </button>
                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          
                          <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: '1rem', cursor: 'pointer' }}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                      <span>Subtotal:</span>
                      <strong>${cartTotal.toFixed(2)}</strong>
                    </div>

                    {cashbackBalance > 0 && (
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={useCashback} 
                            onChange={(e) => setUseCashback(e.target.checked)} 
                            style={{ width: '1.25rem', height: '1.25rem' }}
                          />
                          <span>Usar mi cashback disponible (${cashbackBalance.toFixed(2)})</span>
                        </label>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      <span>Total a pagar:</span>
                      <span>${amountToPay.toFixed(2)}</span>
                    </div>

                    <div style={{ background: '#FFF8E1', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px dashed #FFC107' }}>
                      <p style={{ color: '#B78103', margin: 0 }}>
                        <Star size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                        Al finalizar esta compra ganarás <strong>${potentialCashback.toFixed(2)}</strong> de cashback
                      </p>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleConfirmPurchase}>
                      Confirmar Compra
                    </button>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="var(--color-tertiary)" style={{ margin: '0 auto 1rem auto' }} />
                <h2 style={{ color: 'var(--color-tertiary)', margin: '1rem 0' }}>¡Compra exitosa!</h2>
                <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tu pedido está en camino.</p>
                <div style={{ background: '#FFF8E1', padding: '1.5rem', borderRadius: '0.5rem', display: 'inline-block', marginBottom: '2rem', border: '1px solid #FFC107' }}>
                  <p style={{ fontWeight: 'bold', color: '#B78103', fontSize: '1.2rem', margin: 0 }}>
                    ¡Has ganado ${earnedCashback.toFixed(2)} en cashback!
                  </p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsCartOpen(false)}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Chatbot />
    </>
  );
}
