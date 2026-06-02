/**
 * PAYSTACK CHECKOUT INTEGRATION
 * 
 * This file handles all the checkout functionality for your Azani project.
 * It manages the modal display and Paystack payment processing.
 */

// ============================================================
// CONFIGURATION & INITIALIZATION
// ============================================================

// Your Paystack Public Key (SAFE to use in frontend - it's meant to be public)
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// Store current order details
let currentOrder = {
    planName: '',
    price: 0,
    planId: ''
};

// Get DOM elements
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const closeButton = document.querySelector('.checkout-close-btn');
const paymentButton = document.getElementById('paymentButton');
const orderNowButtons = document.querySelectorAll('.order-now-button');

// ============================================================
// EVENT LISTENERS - OPENING MODAL
// ============================================================

/**
 * Listen for clicks on all "Order Now" buttons
 * When clicked, open the modal and populate it with selected plan details
 */
orderNowButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Extract plan details from button attributes
        const planName = button.getAttribute('data-plan-name');
        const price = button.getAttribute('data-price');
        const planId = button.getAttribute('data-plan-id');
        
        // Store the current order details
        currentOrder = {
            planName: planName,
            price: parseInt(price),
            planId: planId
        };
        
        // Update the modal with order details
        updateOrderSummary();
        
        // Open the modal
        openModal();
    });
});

/**
 * Close modal when X button is clicked
 */
closeButton.addEventListener('click', closeModal);

/**
 * Close modal when clicking outside the modal (on overlay)
 */
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        closeModal();
    }
});

/**
 * Close modal when pressing Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkoutModal.classList.contains('active')) {
        closeModal();
    }
});

// ============================================================
// MODAL FUNCTIONS
// ============================================================

/**
 * Open the checkout modal and display it on screen
 */
function openModal() {
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
}

/**
 * Close the checkout modal
 */
function closeModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable body scroll
    resetCheckoutForm();
}

/**
 * Update the order summary section with selected plan details
 */
function updateOrderSummary() {
    // Display plan name
    document.getElementById('summaryPlanName').textContent = currentOrder.planName;
    
    // Display price in KES currency
    document.getElementById('summaryPrice').textContent = `KES ${currentOrder.price}`;
    
    // Display total (same as price for now, can add taxes/fees later)
    document.getElementById('summaryTotal').textContent = `KES ${currentOrder.price}`;
}

/**
 * Reset the checkout form to initial state
 */
function resetCheckoutForm() {
    checkoutForm.reset();
    hideError();
    hideSuccess();
    paymentButton.disabled = false;
    document.getElementById('buttonText').textContent = 'Pay with Paystack';
}

// ============================================================
// ERROR & SUCCESS MESSAGE HANDLING
// ============================================================

/**
 * Display an error message to the user
 */
function showError(message) {
    const errorDiv = document.getElementById('checkoutError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    // Auto-hide after 5 seconds
    setTimeout(hideError, 5000);
}

/**
 * Hide the error message
 */
function hideError() {
    document.getElementById('checkoutError').style.display = 'none';
}

/**
 * Display a success message to the user
 */
function showSuccess(message) {
    const successDiv = document.getElementById('checkoutSuccess');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

/**
 * Hide the success message
 */
function hideSuccess() {
    document.getElementById('checkoutSuccess').style.display = 'none';
}

// ============================================================
// FORM VALIDATION
// ============================================================

/**
 * Validate checkout form inputs
 * Returns true if valid, false otherwise
 */
function validateForm() {
    const email = document.getElementById('customerEmail').value.trim();
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    // Check if all fields are filled
    if (!email || !name || !phone) {
        showError('❌ Please fill in all fields');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('❌ Please enter a valid email address');
        return false;
    }
    
    // Validate phone (at least 10 digits)
    const phoneRegex = /^[\d\+\-\s\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 9) {
        showError('❌ Please enter a valid phone number');
        return false;
    }
    
    return true;
}

// ============================================================
// PAYSTACK PAYMENT PROCESSING
// ============================================================

/**
 * Handle form submission - Initialize Paystack payment
 */
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const email = document.getElementById('customerEmail').value.trim();
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    // Show loading state on button
    paymentButton.disabled = true;
    document.getElementById('buttonText').textContent = 'Processing... ⏳';
    
    try {
        // Initialize Paystack payment
        initializePaystackPayment(email, name, phone);
    } catch (error) {
        console.error('Payment error:', error);
        showError('❌ An error occurred. Please try again.');
        paymentButton.disabled = false;
        document.getElementById('buttonText').textContent = 'Pay with Paystack';
    }
});

/**
 * Initialize Paystack payment modal
 * 
 * WHAT THIS DOES:
 * 1. Creates a unique reference for this transaction
 * 2. Calls Paystack.charge() which opens Paystack's secure payment form
 * 3. Handles success/error responses from Paystack
 * 
 * TEST CARD NUMBERS FOR TESTING:
 * - Visa: 4111 1111 1111 1111
 * - Master Card: 5555 5555 5555 4444
 * - Verve Card: 5061 0100 0000 0000 50
 * 
 * Test expiry: Any future date (e.g., 12/25)
 * Test CVV: Any 3 digits (e.g., 123)
 */
function initializePaystackPayment(email, name, phone) {
    // Create a unique reference for this transaction
    // Format: AZANI-[timestamp]-[random]
    const reference = 'AZANI-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    
    // Create the Paystack handler
    const handler = PaystackPop.setup({
        // Your Paystack public key
        key: PAYSTACK_PUBLIC_KEY,
        
        // Email of the customer
        email: email,
        
        // Amount in KOBO (1 KES = 100 KOBO)
        // So multiply price by 100
        amount: currentOrder.price * 100,
        
        // Unique reference for this transaction
        ref: reference,
        
        // Customer details (optional but good for records)
        metadata: {
            custom_fields: [
                {
                    display_name: 'Full Name',
                    variable_name: 'full_name',
                    value: name
                },
                {
                    display_name: 'Phone Number',
                    variable_name: 'phone_number',
                    value: phone
                },
                {
                    display_name: 'Plan',
                    variable_name: 'plan',
                    value: currentOrder.planName
                },
                {
                    display_name: 'Plan ID',
                    variable_name: 'plan_id',
                    value: currentOrder.planId
                }
            ]
        },
        
        // Called when payment is successful
        onClose: function() {
            console.log('Payment closed by user or completed');
            // Optionally verify the payment on your backend
            verifyPayment(reference, email);
        },
        
        // Called when payment is successful
        onSuccess: function(response) {
            console.log('Payment successful!', response);
            handlePaymentSuccess(response, name, email, phone);
        }
    });
    
    // Open Paystack payment form
    handler.openIframe();
}

/**
 * Handle successful payment
 * 
 * This function is called when Paystack confirms the payment was successful.
 * In a production environment, you would:
 * 1. Send this info to your backend to verify
 * 2. Create an order record in your database
 * 3. Send a confirmation email with download link
 */
function handlePaymentSuccess(response, name, email, phone) {
    console.log('Processing successful payment:', response);
    
    // Show success message
    showSuccess(
        `✅ Payment successful! Transaction Reference: ${response.reference}\n\n` +
        `An email confirmation will be sent to ${email}.\n` +
        `You will receive access to your ${currentOrder.planName} shortly.`
    );
    
    // Log the payment details (in production, send to backend)
    const paymentData = {
        reference: response.reference,
        planName: currentOrder.planName,
        planId: currentOrder.planId,
        amount: currentOrder.price,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        timestamp: new Date().toISOString()
    };
    
    console.log('Payment Data:', paymentData);
    
    // Reset button state after 2 seconds
    setTimeout(() => {
        paymentButton.disabled = false;
        document.getElementById('buttonText').textContent = 'Pay with Paystack';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closeModal();
            // Show a thank you message
            alert(
                `Thank you for your purchase, ${name}!\n\n` +
                `You will receive your ${currentOrder.planName} access details via email at ${email}.\n\n` +
                `Order Reference: ${response.reference}`
            );
        }, 1000);
    }, 2000);
    
    // TODO: In production, send this data to your backend API:
    // fetch('/api/process-payment', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(paymentData)
    // })
}

/**
 * Verify payment with Paystack
 * This is optional but recommended for additional security
 * 
 * In production, this should be done on your backend server
 * using your SECRET key (never in frontend)
 */
function verifyPayment(reference, email) {
    console.log(`Verifying payment with reference: ${reference}`);
    
    // NOTE: This verification should happen on your backend
    // using your Paystack SECRET key, not in the frontend.
    // 
    // Backend endpoint example:
    // GET /api/verify-payment?reference=AZANI-1234567890-1234
    //
    // Your backend would then call:
    // https://api.paystack.co/transaction/verify/{reference}
    // with your SECRET key in the Authorization header
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format currency for display
 */
function formatCurrency(amount) {
    return 'KES ' + amount.toLocaleString('en-KE');
}

/**
 * Log payment information (for debugging)
 */
function logPaymentInfo() {
    console.log('=== PAYMENT INFO ===');
    console.log('Current Order:', currentOrder);
    console.log('Paystack Public Key:', PAYSTACK_PUBLIC_KEY);
    console.log('Modal Status:', checkoutModal.classList.contains('active') ? 'Open' : 'Closed');
}

// ============================================================
// INITIALIZATION ON PAGE LOAD
// ============================================================

/**
 * Initialize when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js loaded successfully');
    console.log('Paystack integration ready');
    
    // You can add any initialization code here if needed
    // For example, pre-fill form fields if you have user data available
});

// ============================================================
// DEBUGGING & TESTING
// ============================================================

/**
 * Test payment data (for development)
 * You can call this in the browser console to test:
 * testPaymentFlow()
 */
function testPaymentFlow() {
    console.log('Starting test payment flow...');
    
    // Simulate clicking an "Order Now" button
    currentOrder = {
        planName: 'Database Application',
        price: 800,
        planId: 'db-app'
    };
    
    updateOrderSummary();
    openModal();
    
    // Pre-fill form for testing
    document.getElementById('customerEmail').value = 'test@example.com';
    document.getElementById('customerName').value = 'Test User';
    document.getElementById('customerPhone').value = '254712345678';
    
    console.log('Test modal opened. Fill form and click Pay to test Paystack integration.');
}

// ============================================================
// EXPORTS FOR BROWSER CONSOLE DEBUGGING
// ============================================================

// Make functions available in browser console for testing
window.checkoutDebug = {
    testPaymentFlow,
    logPaymentInfo,
    openModal,
    closeModal,
    currentOrder: () => currentOrder
};

console.log('💳 Checkout Debug Commands Available');
console.log('Try in console: window.checkoutDebug.testPaymentFlow()');
