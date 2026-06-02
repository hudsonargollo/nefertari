import Home from './components/Home';

export const metadata = {
  title: 'Nefertari Cozinha Viva — Jequié, BA',
  description: 'Lanches artesanais feitos com ingredientes que você reconhece. Hambúrgueres, wraps e muito mais — sem ultraprocessados, sem taxas de marketplace.',
  keywords: ['lanche artesanal', 'comida saudável Jequié', 'hambúrguer vegano', 'Nefertari', 'cozinha viva', 'delivery Jequié'],
  openGraph: {
    title: 'Nefertari Cozinha Viva',
    description: 'Alimentar o corpo como um ato sagrado. Jequié, BA.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function HomePage() {
  return <Home />;
}
