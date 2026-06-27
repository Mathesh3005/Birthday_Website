import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomePage = () => {
    const { data: products, isLoading, error } = useGetProductsQuery({});

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <h1 className='text-3xl font-bold mb-6 text-gray-800'>Latest Products</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default HomePage;
