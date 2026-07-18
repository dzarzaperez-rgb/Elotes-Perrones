export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'elote' | 'esquite' | 'bebida' | 'otro';
}

export interface User {
  id: string;
  email: string;
}
