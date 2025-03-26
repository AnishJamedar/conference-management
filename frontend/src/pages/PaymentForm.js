import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registrationId, ticketType } = location.state || {};

  useEffect(() => {
    const renderPayPalButtons = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async () => {
            try {
              const response = await fetch(
                'http://localhost:5001/api/registrations/create-paypal-order',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ registrationId, ticketType }),
                }
              );
              const data = await response.json();
              if (!response.ok) throw new Error(data.error || 'Failed to create PayPal order');
              return data.id;
            } catch (err) {
              console.error('Error creating PayPal order:', err);
              alert('Failed to initiate payment. Please try again.');
            }
          },
          onApprove: async (data) => {
            try {
              const response = await fetch(
                'http://localhost:5001/api/registrations/capture-paypal-order',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: data.orderID, registrationId }),
                }
              );
              const captureData = await response.json();
              if (!response.ok) throw new Error(captureData.error || 'Failed to capture payment');
              alert('Payment Successful');

              // Clear any session/local data if needed (optional)
              // localStorage.clear(); // Example: Clear stored user data

              // Redirect to login page after payment success
              navigate('/login', { state: { message: 'Payment completed. Please log in again.' } });
            } catch (err) {
              console.error('Error capturing payment:', err);
              alert('Payment capture failed. Please try again.');
            }
          },
          onError: (err) => {
            console.error('PayPal payment error:', err);
            alert('An error occurred during payment. Please try again.');
          },
        }).render('#paypal-button-container');
      } else {
        console.error('PayPal SDK not loaded');
        alert('Failed to load PayPal SDK. Please refresh the page.');
      }
    };

    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
      script.onload = () => renderPayPalButtons();
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        alert('Unable to load PayPal SDK. Please try again later.');
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup script if the component unmounts
        document.body.removeChild(script);
      };
    };

    if (window.paypal) {
      renderPayPalButtons();
    } else {
      loadPayPalScript();
    }
  }, [registrationId, ticketType, navigate]);

  if (!registrationId || !ticketType) {
    return <p>Error: Registration details are missing.</p>;
  }

  return (
    <div>
      <h1>Complete Your Payment</h1>
      <p>Please proceed with payment for the {ticketType} ticket.</p>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PaymentForm;
