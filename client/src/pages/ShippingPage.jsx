import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingPage = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        // navigate('/payment'); // Skip Payment screen for now as requested "fake payment" flow usually implies just clicking "Place Order" or a simple "Select method"
        // I will redirect to placeorder page (but I haven't created it yet). 
        // For MVP, if payment page is missing, let's redirect to a PlaceOrder page directly or stay here.
        // I'll create a simple placeholder alert for now or redirect to home.
        alert('Shipping saved. Proceed to payment/place order (Not implemented yet in this turn).');
        navigate('/');
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Shipping</h1>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">City</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Postal Code</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Country</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded mt-1"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-black">
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;
