import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { Product } from '../types';
import { Flame, LogOut, Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Product['category']>('elote');

  useEffect(() => {
    // Verificamos si hay sesión en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin');
      }
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImageUrl(product.imageUrl);
      setCategory(product.category);
    } else {
      setEditingProduct(null);
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategory('elote');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingProduct) {
      await updateProduct({
        id: editingProduct.id,
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
      });
    } else {
      await addProduct({
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
      });
    }
    
    setSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo" style={{ marginBottom: '2rem' }}>
          <Flame color="#FF5A1F" size={24} />
          <span style={{fontSize: '1.25rem'}}>Admin</span>
        </div>
        <nav style={{ flex: 1 }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Menú / Productos</a>
            </li>
            <li>
              <Link to="/" style={{ color: 'var(--color-text-light)' }}>Ver Tienda</Link>
            </li>
          </ul>
        </nav>
        <button className="btn btn-outline" onClick={handleLogout}>
          <LogOut size={18} /> Salir
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>Gestión de Productos</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} /> Nuevo Producto
          </button>
        </header>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Cargando productos...</td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: '600' }}>{product.name}</span>
                  </td>
                  <td><span className="product-badge" style={{ position: 'static' }}>{product.category}</span></td>
                  <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>${product.price.toFixed(2)}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-icon" onClick={() => openModal(product)} style={{ backgroundColor: '#e2e8f0' }} title="Editar">
                        <Edit2 size={16} color="#475569" />
                      </button>
                      <button className="btn btn-icon" onClick={() => handleDelete(product.id)} style={{ backgroundColor: '#fee2e2' }} title="Eliminar">
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!productsLoading && products.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No hay productos registrados en Supabase.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !saving && setIsModalOpen(false)} disabled={saving}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required disabled={saving} />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows={3} required disabled={saving}></textarea>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Precio ($)</label>
                  <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required disabled={saving} />
                </div>
                <div>
                  <label className="form-label">Categoría</label>
                  <select className="form-control" value={category} onChange={e => setCategory(e.target.value as Product['category'])} required disabled={saving}>
                    <option value="elote">Elote</option>
                    <option value="esquite">Esquite</option>
                    <option value="bebida">Bebida</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL de Imagen</label>
                <input type="url" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required placeholder="https://..." disabled={saving} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
