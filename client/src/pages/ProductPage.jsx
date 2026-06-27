import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);

    const {
        data: product,
        isLoading,
        error,
    } = useGetProductDetailsQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    return (
        <>
            <Link className='flex items-center text-gray-600 hover:text-primary mb-4' to='/'>
                <FaArrowLeft className="mr-1" />
                Go Back
            </Link>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {/* Image */}
                    <div className="md:col-span-1">
                        <img src={product.images[0]} alt={product.name} className="w-full rounded-lg shadow-lg" />
                    </div>

                    {/* Details */}
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="text-3xl font-bold text-gray-800">{product.name}</h3>

                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

                        <div className="text-2xl font-bold text-gray-900">${product.price}</div>

                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700">Price:</span>
                                <span className="font-bold">${product.price}</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-700">Status:</span>
                                <span className={product.stock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                    {product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                                </span>
                            </div>

                            {product.stock > 0 && (
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-700">Quantity</span>
                                    <select
                                        className="border rounded p-1"
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                    >
                                        {[...Array(product.stock).keys()].slice(0, 10).map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                className={`w-full py-3 rounded text-white font-bold transition-colors ${product.stock === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-secondary hover:bg-yellow-500 text-black' // Amazon-like button
                                    }`}
                                type='button'
                                disabled={product.stock === 0}
                                onClick={addToCartHandler}
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductPage;
