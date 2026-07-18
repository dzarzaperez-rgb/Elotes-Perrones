import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto');
      return null;
    }
    
    setProducts([data, ...products]);
    return data;
  };

  const updateProduct = async (updated: Product) => {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updated.name,
        description: updated.description,
        price: updated.price,
        imageUrl: updated.imageUrl,
        category: updated.category
      })
      .eq('id', updated.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
      return null;
    }

    setProducts(products.map(p => (p.id === updated.id ? data : p)));
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
      return false;
    }

    setProducts(products.filter(p => p.id !== id));
    return true;
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
}
