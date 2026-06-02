import { Suspense } from 'react';
import OrderStatus from '../components/OrderStatus';

export const metadata = {
  title: 'Acompanhar pedido — Nefertari Cozinha Viva',
};

export default function PedidoPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#FAF5E8', minHeight: '100dvh', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#A89070' }}>
        Carregando...
      </div>
    }>
      <OrderStatus />
    </Suspense>
  );
}
