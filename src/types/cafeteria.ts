export type CategoryId =
  | 'promociones'
  | 'novedades'
  | 'combos'
  | 'ensaladas'
  | 'almuerzos'
  | 'bebidas'
  | 'cenas'
  | 'saludable';

export type AppTab = 'inicio' | 'cupones' | 'pedido' | 'cuenta';

export type DeliveryMode = 'pickup' | 'delivery';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  description: string;
  ingredients: string[];
  prepMinutes: number;
  calories: number;
  image: string;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PointsMovement {
  id: string;
  date: string;
  description: string;
  amount: number; // positive = earned, negative = redeemed
  balanceAfter: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  discountApplied: number;
  totalPaid: number;
  pointsEarned: number;
  deliveryMode: DeliveryMode;
  deliveryLocation: string;
  status: 'Enviado a cocina' | 'Listo para retirar';
}

export interface UserAccount {
  name: string;
  email: string;
  faculty: string;
  defaultBuilding: string;
  pointsBalance: number;
  orders: OrderRecord[];
  movements: PointsMovement[];
}

export interface VoteOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  estimatedPrice: number;
  image: string;
  initialVotes: number;
}
