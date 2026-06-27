import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListPage = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
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
                                <th className="py-2 px-4 border-b">USER</th>
                                <th className="py-2 px-4 border-b">DATE</th>
                                <th className="py-2 px-4 border-b">TOTAL</th>
                                <th className="py-2 px-4 border-b">PAID</th>
                                <th className="py-2 px-4 border-b">DELIVERED</th>
                                <th className="py-2 px-4 border-b">DETAILS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="text-center">
                                    <td className="py-2 px-4 border-b">{order._id}</td>
                                    <td className="py-2 px-4 border-b">{order.user && order.user.name}</td>
                                    <td className="py-2 px-4 border-b">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-2 px-4 border-b">${order.totalPrice}</td>
                                    <td className="py-2 px-4 border-b">
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <FaTimes className="text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <FaTimes className="text-red-500 mx-auto" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <Link to={`/order/${order._id}`} className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded text-sm">
                                            Details
                                        </Link>
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

export default OrderListPage;
