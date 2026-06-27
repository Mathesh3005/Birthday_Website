import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/Message';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
                <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to='/' className="text-primary underline">Go Back</Link>
                    </Message>
                ) : (
                    <div className='space-y-4'>
                        {cartItems.map((item) => (
                            <div key={item._id} className='flex items-center justify-between border-b pb-4'>
                                <div className='flex items-center space-x-4'>
                                    <img src={item.images[0]} alt={item.name} className='w-20 h-20 object-cover rounded' />
                                    <Link to={`/product/${item._id}`} className='text-lg font-semibold hover:text-primary max-w-xs truncate'>
                                        {item.name}
                                    </Link>
                                </div>

                                <div className='flex items-center space-x-4'>
                                    <span className="font-bold">${item.price}</span>

                                    <select
                                        className="border rounded p-1"
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                    >
                                        {[...Array(item.stock).keys()].slice(0, 10).map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type='button'
                                        className='text-red-600 hover:text-red-800'
                                        onClick={() => removeFromCartHandler(item._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='md:col-span-1'>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                        Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                    </h2>
                    <div className="text-xl font-bold mb-6">
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </div>
                    <button
                        type='button'
                        className='w-full bg-secondary text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 disabled:opacity-50'
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                    >
                        Proceed To Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
