import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useCreateProductMutation
} from '../../slices/productsApiSlice';

const ProductListPage = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery({});

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const navigate = useNavigate();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
                toast.success('Product created');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    className="flex items-center bg-primary text-white py-2 px-4 rounded hover:bg-black"
                    onClick={createProductHandler}
                >
                    <FaPlus className="mr-2" /> Create Product
                </button>
            </div>

            {loadingDelete && <Loader />}
            {loadingCreate && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">NAME</th>
                                <th className="py-2 px-4 border-b">PRICE</th>
                                <th className="py-2 px-4 border-b">CATEGORY</th>
                                <th className="py-2 px-4 border-b">BRAND</th>
                                <th className="py-2 px-4 border-b">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="text-center">
                                    <td className="py-2 px-4 border-b">{product._id}</td>
                                    <td className="py-2 px-4 border-b">{product.name}</td>
                                    <td className="py-2 px-4 border-b">${product.price}</td>
                                    <td className="py-2 px-4 border-b">{product.category?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{product.brand}</td>
                                    <td className="py-2 px-4 border-b space-x-2">
                                        <Link to={`/admin/product/${product._id}/edit`} className="text-blue-500 hover:text-blue-700">
                                            <FaEdit />
                                        </Link>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ProductListPage;
