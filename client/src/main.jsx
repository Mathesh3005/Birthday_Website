import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import './index.css';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ProductListPage from './pages/admin/ProductListPage.jsx';
import OrderListPage from './pages/admin/OrderListPage.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index={true} path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            {/* Registered users */}
            <Route path='' element={<PrivateRoute />}>
                <Route path='/shipping' element={<ShippingPage />} />
                <Route path='/payment' element={<PaymentPage />} />
                <Route path='/placeorder' element={<PlaceOrderPage />} />
                <Route path='/order/:id' element={<OrderPage />} />
            </Route>

            {/* Admin users */}
            <Route path='' element={<AdminRoute />}>
                <Route path='/admin/productlist' element={<ProductListPage />} />
                <Route path='/admin/orderlist' element={<OrderListPage />} />
            </Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
