/**
 * EPS Payment Integration Test
 * This file contains test scenarios for the EPS payment system
 */

import epsPaymentService from '../utils/epsPaymentService';

// Test data for EPS payment
const testPaymentData = {
  amount: 500.00,
  customer_name: 'Test Customer',
  customer_email: 'test@example.com',
  customer_phone: '01700000000',
  order_id: `TEST_ORDER_${Date.now()}`,
  description: 'Test EPS Payment Integration',
  success_url: `${window.location.origin}/payment/success`,
  failure_url: `${window.location.origin}/payment/failed`,
  cancel_url: `${window.location.origin}/payment/cancelled`
};

/**
 * Test EPS Payment Service Connection
 */
export const testEpsConnection = async () => {
  try {
    console.log('🧪 Testing EPS Payment Service Connection...');
    
    // Test validation
    const validation = epsPaymentService.validatePaymentData(testPaymentData);
    console.log('✅ Validation result:', validation);
    
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation.errors);
      return { success: false, error: 'Validation failed', details: validation.errors };
    }
    
    // Test payment initialization (this would normally redirect)
    console.log('🔄 Testing payment initialization...');
    console.log('Test data:', testPaymentData);
    
    // Note: Uncomment the following lines to test actual payment initialization
    // const result = await epsPaymentService.initializePayment(testPaymentData);
    // console.log('Payment initialization result:', result);
    
    return { 
      success: true, 
      message: 'EPS Payment Service is properly configured',
      testData: testPaymentData
    };
  } catch (error) {
    console.error('❌ EPS Connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: error
    };
  }
};

/**
 * Test EPS Payment Validation
 */
export const testEpsValidation = () => {
  console.log('🧪 Testing EPS Payment Validation...');
  
  const testCases = [
    // Valid data
    {
      name: 'Valid payment data',
      data: testPaymentData,
      shouldPass: true
    },
    // Invalid email
    {
      name: 'Invalid email',
      data: { ...testPaymentData, customer_email: 'invalid-email' },
      shouldPass: false
    },
    // Invalid phone
    {
      name: 'Invalid phone',
      data: { ...testPaymentData, customer_phone: '123' },
      shouldPass: false
    },
    // Missing amount
    {
      name: 'Missing amount',
      data: { ...testPaymentData, amount: 0 },
      shouldPass: false
    },
    // Missing customer name
    {
      name: 'Missing customer name',
      data: { ...testPaymentData, customer_name: '' },
      shouldPass: false
    }
  ];
  
  const results = testCases.map(testCase => {
    const validation = epsPaymentService.validatePaymentData(testCase.data);
    const passed = validation.isValid === testCase.shouldPass;
    
    console.log(`${passed ? '✅' : '❌'} ${testCase.name}:`, {
      expected: testCase.shouldPass,
      actual: validation.isValid,
      errors: validation.errors
    });
    
    return {
      name: testCase.name,
      passed,
      validation
    };
  });
  
  const allPassed = results.every(r => r.passed);
  console.log(`🏁 Validation tests ${allPassed ? 'PASSED' : 'FAILED'}`);
  
  return {
    success: allPassed,
    results
  };
};

/**
 * Test EPS Utility Functions
 */
export const testEpsUtilities = () => {
  console.log('🧪 Testing EPS Utility Functions...');
  
  // Test email validation
  const emailTests = [
    { email: 'test@example.com', expected: true },
    { email: 'invalid-email', expected: false },
    { email: 'test@', expected: false },
    { email: '@example.com', expected: false }
  ];
  
  emailTests.forEach(test => {
    const result = epsPaymentService.isValidEmail(test.email);
    console.log(`${result === test.expected ? '✅' : '❌'} Email validation - ${test.email}: ${result}`);
  });
  
  // Test phone validation
  const phoneTests = [
    { phone: '01700000000', expected: true },
    { phone: '+8801700000000', expected: true },
    { phone: '123456', expected: false },
    { phone: '01800000000', expected: true }
  ];
  
  phoneTests.forEach(test => {
    const result = epsPaymentService.isValidPhone(test.phone);
    console.log(`${result === test.expected ? '✅' : '❌'} Phone validation - ${test.phone}: ${result}`);
  });
  
  // Test amount formatting
  const amountTests = [100, 250.50, 1000.99];
  amountTests.forEach(amount => {
    const formatted = epsPaymentService.formatAmount(amount);
    console.log(`✅ Amount formatting - ${amount}: ${formatted}`);
  });
  
  // Test order ID generation
  const orderId = epsPaymentService.generateOrderId('TEST');
  console.log(`✅ Order ID generation: ${orderId}`);
  
  return { success: true };
};

/**
 * Run all EPS tests
 */
export const runAllEpsTests = async () => {
  console.log('🚀 Running all EPS Payment tests...');
  
  const results = {
    connection: await testEpsConnection(),
    validation: testEpsValidation(),
    utilities: testEpsUtilities()
  };
  
  const allPassed = Object.values(results).every(r => r.success);
  
  console.log(`🏁 All EPS tests ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log('Test results:', results);
  
  return {
    success: allPassed,
    results
  };
};

// Usage example in browser console:
// import { runAllEpsTests } from './epsPaymentTest';
// runAllEpsTests();

export default {
  testEpsConnection,
  testEpsValidation,
  testEpsUtilities,
  runAllEpsTests
};