import { useNavigate } from 'react-router-dom';

// I should use Tailwind components or headless UI or standard HTML. 
// The user said "Styling: Tailwind CSS". 
// I should avoid react-bootstrap if possible or use it with custom class. 
// Actually, standard HTML/JSX with Tailwind classes is better.

import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';


const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Since I don't have usersApiSlice defined yet with logout mutation (backend doesn't have logout endpoint specifically for JWT unless cookie based, but I'll clear local state).
    // I'll implement simple logout.

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header>
            <nav className="bg-primary text-white py-4">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link to="/" className="text-2xl font-bold flex items-center">
                        ShopZone
                    </Link>

                    <div className="flex-grow mx-10 hidden md:block">
                        {/* Search Box placeholder */}
                        <div className="relative">
                            <input type="text" className="w-full p-2 rounded text-black" placeholder="Search Products..." />
                            <button className="absolute right-0 top-0 p-2 text-primary">
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="flex items-center hover:text-secondary relative">
                            <FaShoppingCart className="mr-1" />
                            Cart
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full px-2 text-xs font-bold">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {userInfo ? (
                            <div className="relative group">
                                <button className="flex items-center hover:text-secondary">
                                    <FaUser className="mr-1" />
                                    {userInfo.name}
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black shadow-lg rounded hidden group-hover:block z-50">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                    <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center hover:text-secondary">
                                <FaUser className="mr-1" />
                                Sign In
                            </Link>
                        )}

                        {userInfo && userInfo.role === 'admin' && (
                            <div className="relative group ml-4">
                                <button className="flex items-center hover:text-secondary">
                                    Admin
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black shadow-lg rounded hidden group-hover:block z-50">
                                    <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">Products</Link>
                                    <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                                    <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;
