import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
    return (
        <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.images[0]} // Using first image
                    alt={product.name}
                    className='w-full h-48 object-cover'
                />
            </Link>

            <div className='p-4'>
                <Link to={`/product/${product._id}`}>
                    <h3 className='text-lg font-semibold text-gray-800 hover:text-primary truncate mb-2'>
                        {product.name}
                    </h3>
                </Link>

                <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                />

                <h3 className='text-xl font-bold text-gray-900 mt-2'>${product.price}</h3>
            </div>
        </div>
    );
};

export default Product;
