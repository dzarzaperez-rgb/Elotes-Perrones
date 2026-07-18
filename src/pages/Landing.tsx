import { Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { Flame, Star } from 'lucide-react';

export default function Landing() {
  const { products, loading } = useProducts();

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <Flame color="#FF5A1F" size={32} />
            Elotes<span>Perrones</span>
          </Link>
          <nav className="nav-links">
            <a href="#menu" className="nav-link">Menú</a>
            <a href="#about" className="nav-link">Nosotros</a>
            <Link to="/admin" className="btn btn-primary">Admin</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Los mejores esquites de la ciudad</h1>
            <p>Preparados con la receta secreta de la abuela, mucho chilito del que sí pica y un toque de amor perrón.</p>
            <a href="#menu" className="btn btn-primary">Ver Menú <Star size={20} /></a>
          </div>
        </section>

        <section id="menu" className="product-section container">
          <h2 className="section-title">Nuestro Menú</h2>
          <div className="product-grid">
            {/* Static Menu Items requested by the user */}
            {[
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
            ].map((product) => (
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
                    <button className="btn btn-secondary btn-icon" title="¡Lo quiero!">
                      <Flame size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Dynamic Menu Items */}
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
                    <button className="btn btn-secondary btn-icon" title="¡Lo quiero!">
                      <Flame size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontSize: '1.25rem' }}>Cargando más de nuestro delicioso menú...</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
