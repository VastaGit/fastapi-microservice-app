import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/Products';
import CreateProduct from './components/CreateProduct';
import Orders from './components/Orders';
import MakeOrder from './components/MakeOrder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/make-order" element={<MakeOrder />} />

      </Routes>
    </Router>
  );
}

export default App;
