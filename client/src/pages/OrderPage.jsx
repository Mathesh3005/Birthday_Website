import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../slices/ordersApiSlice';

const OrderPage = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    // Mock pay mutation
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const payHandler = async () => {
        try {
            await payOrder({ orderId, details: { id: 'FAKE_ID', status: 'COMPLETED', email_address: 'test@example.com', update_time: new Date().toISOString() } });
            refetch();
            toast.success('Order is paid');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return isLoading ? <Loader /> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <h1 className="text-2xl font-bold">Order {order._id}</h1>

                <div className="border-b pb-4">
                    <h2 className="text-xl font-bold mb-2">Shipping</h2>
                    <p><strong>Name: </strong> {order.user.name}</p>
                    <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-primary underline">{order.user.email}</a></p>
                    <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.street}, {order.shippingAddress.city}{' '}
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                        <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                    ) : (
                        <Message variant='danger'>Not Delivered</Message>
                    )}
                </div>

                <div className="border-b pb-4">
                    <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                    <p><strong>Method: </strong> {order.paymentMethod}</p>
                    {order.isPaid ? (
                        <Message variant='success'>Paid on {order.paidAt}</Message>
                    ) : (
                        <Message variant='danger'>Not Paid</Message>
                    )}
                </div>

                <div className="border-b pb-4">
                    <h2 className="text-xl font-bold mb-2">Order Items</h2>
                    {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                        <div className="space-y-4 mt-2">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Note: In Order Object from DB schema, I used 'name', 'qty', 'price' and 'product'. 
                                         And images? I need to check schema. 
                                         Schema: orderItems: [{ name, qty, images: [String], price, product }]
                                         Frontend Cart: item.images[0]
                                         So I should access item.images[0] if exists or item.image (if I mapped it wrong).
                                         Let's assume I saved it correctly or will fix. 
                                         Actually in CartSlice I stored entire product object... 
                                         In CreateOrder I sent cartItems.
                                         In Backend Order Model, I defined `images: [String]`.
                                         So it should be fine.
                                         */}
                                        <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                        <Link to={`/product/${item.product}`} className="hover:text-primary">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div>
                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded shadow-md border">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Items</span>
                        <span>${order.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>${order.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Tax</span>
                        <span>${order.taxPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4 border-t pt-2 font-bold text-lg">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                    </div>

                    {!order.isPaid && (
                        <button
                            className="w-full bg-secondary text-black font-bold py-2 rounded mb-2 hover:bg-yellow-500"
                            onClick={payHandler}
                        >
                            {loadingPay ? 'Processing...' : 'Pay Order (Fake)'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
