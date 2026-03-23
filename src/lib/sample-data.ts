// Sample phishing templates for quick testing
export const SAMPLE_EMAILS = [
  {
    label: 'PayPal Scam',
    body: `Subject: URGENT: Your Account Has Been Compromised!\n\nDear Customer,\n\nWe detected unusual activity on your PayPal account. Your account has been temporarily suspended due to unauthorized access.\n\nYou must verify your identity immediately to restore access. Click the link below to confirm your account:\n\nhttps://secure-paypal-verify.tk/login\n\nFailure to verify within 24 hours will result in permanent account closure.\n\nEnter your password and credit card information to complete verification.\n\nPayPal Security Team`,
  },
  {
    label: 'Work-From-Home Scam',
    body: `Congratulations! Your Free Typing Job Account is Ready & Login Detail - Start Earning Today!\n\nDigital Online Works <no-reply@digitalonlineworks.com>\nThu, Mar 19, 6:45 AM\n\nYou have been selected as a lucky winner for our exclusive offer. Claim your prize by clicking the link below and enter your bank account details:\n\nhttps://DigitalOnlineWorks.com/dashboard.html\n\nThis is a limited time offer. Act now before it expires!`,
  },
  {
    label: 'Netflix Phishing',
    body: `Dear User,\n\nYour Netflix subscription payment failed. Update your payment method immediately or your account will be terminated.\n\nClick here to verify: https://netflix-billing-update.xyz/payment\n\nEnter your credit card and billing information to continue your subscription.\n\nThis is your final warning. Failure to update within 48 hours will result in legal action.\n\nNetflix Support`,
  },
  {
    label: 'Lottery Scam',
    body: `CONGRATULATIONS!!!\n\nYou have been selected as a lucky winner of our international lottery!\n\nYou have won $1,000,000 (ONE MILLION DOLLARS)!\n\nClaim your prize now by clicking: https://prize-winners-club.xyz/claim\n\nEnter your bank account details to receive the transfer.\n\nThis is a limited time exclusive offer. Act now!\n\nPrize Committee`,
  },
];

export const SAMPLE_URLS = [
  { label: 'Fake PayPal', url: 'https://paypal-secure-login.tk/verify' },
  { label: 'IP-Based Link', url: 'https://192.168.1.100/amazon-login' },
  { label: 'Shortened Link', url: 'https://bit.ly/3xFakeLink' },
  { label: 'Typosquatting', url: 'https://arnazon-orders.xyz/tracking' },
];

// Simulated inbox emails
export const INBOX_EMAILS = [
  {
    id: '1',
    sender: 'PayPal Security',
    email: 'security@paypa1-support.tk',
    subject: 'URGENT: Your account has been compromised - verify now',
    body: `Dear Customer,\n\nWe detected unauthorized access to your PayPal account. Your account has been temporarily suspended.\n\nClick here to verify your identity immediately: https://paypal-secure-verify.tk/login\n\nEnter your password and credit card to restore access.\n\nFailure to verify within 24 hours will result in permanent closure.\n\nPayPal Security Team`,
    time: '2 min ago',
  },
  {
    id: '2',
    sender: 'Google Workspace',
    email: 'noreply@google.com',
    subject: 'Your storage is 95% full - upgrade now',
    body: `Hi there,\n\nYour Google Workspace storage is nearly full at 95%. Consider upgrading your plan to continue using all features.\n\nVisit https://workspace.google.com/pricing to see available plans.\n\nGoogle Workspace Team`,
    time: '15 min ago',
  },
  {
    id: '3',
    sender: 'Netflix Billing',
    email: 'billing@netflix-update.xyz',
    subject: 'Payment failed - update your billing information immediately',
    body: `Dear User,\n\nYour Netflix subscription payment failed. Update your payment method immediately or your account will be terminated.\n\nClick here to verify: https://netflix-billing-update.xyz/payment\n\nEnter your credit card and billing information.\n\nThis is your final warning. Failure to update within 48 hours will result in legal action.\n\nNetflix Support`,
    time: '1 hr ago',
  },
  {
    id: '4',
    sender: 'Amazon Orders',
    email: 'orders@amazon.com',
    subject: 'Your order #302-1234567 has shipped',
    body: `Hello,\n\nGreat news! Your order has shipped and is on its way.\n\nOrder #302-1234567\nEstimated delivery: March 25-27\n\nTrack your package at https://amazon.com/orders\n\nThank you for shopping with Amazon.`,
    time: '3 hr ago',
  },
  {
    id: '5',
    sender: 'Prize Winners Club',
    email: 'winners@prize-club.xyz',
    subject: 'Congratulations! You have won $1,000,000!',
    body: `CONGRATULATIONS!!!\n\nYou have been selected as a lucky winner of our international lottery!\n\nYou have won $1,000,000 (ONE MILLION DOLLARS)!\n\nClaim your prize now by clicking: https://prize-winners-club.xyz/claim\n\nEnter your bank account details to receive the transfer.\n\nThis is a limited time exclusive offer. Act now!\n\nPrize Committee`,
    time: '5 hr ago',
  },
];
