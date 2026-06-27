import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <div className='flex justify-center mb-4'>
            <div className='flex items-center space-x-4'>
                <div>
                    {step1 ? (
                        <Link to='/login' className='text-primary hover:text-secondary font-bold'>
                            Sign In
                        </Link>
                    ) : (
                        <span className='text-gray-400 cursor-not-allowed'>Sign In</span>
                    )}
                </div>

                <div>
                    {step2 ? (
                        <Link to='/shipping' className='text-primary hover:text-secondary font-bold'>
                            Shipping
                        </Link>
                    ) : (
                        <span className='text-gray-400 cursor-not-allowed'>Shipping</span>
                    )}
                </div>

                <div>
                    {step3 ? (
                        <Link to='/payment' className='text-primary hover:text-secondary font-bold'>
                            Payment
                        </Link>
                    ) : (
                        <span className='text-gray-400 cursor-not-allowed'>Payment</span>
                    )}
                </div>

                <div>
                    {step4 ? (
                        <Link to='/placeorder' className='text-primary hover:text-secondary font-bold'>
                            Place Order
                        </Link>
                    ) : (
                        <span className='text-gray-400 cursor-not-allowed'>Place Order</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;
