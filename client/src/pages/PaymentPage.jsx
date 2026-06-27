import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps.jsx'; // I'll need to create this simple component too

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className='flex justify-center'>
            <div className="w-full max-w-md">
                <CheckoutSteps step1 step2 step3 />
                <h1 className='text-2xl font-bold mb-4'>Payment Method</h1>
                <form onSubmit={submitHandler}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Select Method</label>
                        <div className='flex items-center mb-2'>
                            <input
                                type='radio'
                                className='mr-2'
                                id='PayPal'
                                name='paymentMethod'
                                value='PayPal'
                                checked
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor='PayPal'>PayPal or Credit Card</label>
                        </div>
                    </div>

                    <button type='submit' className='bg-primary text-white py-2 px-4 rounded hover:bg-black'>
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
