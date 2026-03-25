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

// Simulated inbox emails - Gmail-style
export interface InboxEmail {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment?: boolean;
  attachmentName?: string;
  category: 'primary' | 'promotions' | 'social' | 'updates';
  avatar?: string;
}

export const INBOX_EMAILS: InboxEmail[] = [
  {
    id: '1',
    sender: 'LinkedIn',
    email: 'notifications@linkedin.com',
    subject: 'Thank you for purchasing Premium Career',
    preview: 'LinkedIn Purva Badekar Purva, your purchase is confirmed Thank you for purcha...',
    body: `Dear Purva,\n\nThank you for purchasing LinkedIn Premium Career! Your subscription is now active.\n\nWith Premium Career, you can:\n- See who viewed your profile\n- Send InMail to recruiters\n- Access LinkedIn Learning courses\n\nManage your subscription at https://linkedin.com/premium\n\nBest regards,\nLinkedIn Team`,
    time: '10:30 AM',
    date: 'Mar 24',
    read: false,
    starred: false,
    hasAttachment: true,
    attachmentName: 'LNKD_INVOICE...',
    category: 'primary',
  },
  {
    id: '2',
    sender: 'connect',
    email: 'noreply@connect.com',
    subject: 'HackUp PPT submission successful !!',
    preview: 'Dear Team Fantastic Four, We have successfully received your PPT submission for Hac...',
    body: `Dear Team Fantastic Four,\n\nWe have successfully received your PPT submission for HackUp 2024.\n\nSubmission Details:\n- Team: Fantastic Four\n- Track: Cybersecurity\n- Submitted: March 23, 2024\n\nResults will be announced on March 28. Stay tuned!\n\nBest regards,\nHackUp Organizing Committee`,
    time: '9:15 AM',
    date: 'Mar 23',
    read: false,
    starred: false,
    category: 'primary',
  },
  {
    id: '3',
    sender: 'connect',
    email: 'noreply@connect.com',
    subject: 'Your OTP for Login',
    preview: 'Hi Purva Badekar, Your One-Time Password (OTP) for login is: 8265 This OTP is valid for 5 minutes. Please d...',
    body: `Hi Purva Badekar,\n\nYour One-Time Password (OTP) for login is: 8265\n\nThis OTP is valid for 5 minutes. Please do not share this with anyone.\n\nIf you did not request this OTP, please contact support immediately.\n\nRegards,\nConnect Team`,
    time: '8:45 AM',
    date: 'Mar 23',
    read: true,
    starred: false,
    category: 'primary',
  },
  {
    id: '4',
    sender: 'Aditya Chouhan',
    email: 'aditya.chouhan@gmail.com',
    subject: 'Chouhan705 invited you to Chouhan705/Hack-Up-Phishing',
    preview: '@Chouhan705 has invited you to collaborate on the Chouhan705/...',
    body: `@Chouhan705 has invited you to collaborate on the Chouhan705/Hack-Up-Phishing repository on GitHub.\n\nYou can accept or decline this invitation at:\nhttps://github.com/Chouhan705/Hack-Up-Phishing/invitations\n\nThis invitation will expire in 7 days.\n\n@Chouhan705 (Aditya Chouhan)`,
    time: '7:20 AM',
    date: 'Mar 23',
    read: true,
    starred: false,
    category: 'primary',
  },
  {
    id: '5',
    sender: 'ISP Team from Inter.',
    email: 'team@isp-internship.com',
    subject: 'Update: Your application has been accepted',
    preview: 'Skill development opportunity Hello Purva! We noticed your interest in skill dev...',
    body: `Hello Purva!\n\nWe noticed your interest in skill development and we're excited to inform you that your application has been accepted for our internship program.\n\nProgram Details:\n- Duration: 4 weeks\n- Mode: Online\n- Certificate: Yes, upon completion\n\nPlease confirm your participation by March 25.\n\nBest regards,\nISP Team`,
    time: '6:00 PM',
    date: 'Mar 23',
    read: true,
    starred: true,
    category: 'updates',
  },
  {
    id: '6',
    sender: 'GitHub',
    email: 'noreply@github.com',
    subject: '[GitHub] Sudo email verification code',
    preview: 'Please verify your identity, purva0150 Here is your GitHub sudo authentication code: 98...',
    body: `Please verify your identity, purva0150.\n\nHere is your GitHub sudo authentication code: 982451\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, you can ignore this email.\n\nGitHub`,
    time: '3:30 PM',
    date: 'Mar 22',
    read: true,
    starred: false,
    category: 'primary',
  },
  {
    id: '7',
    sender: 'Team Unstop',
    email: 'noreply@unstop.com',
    subject: 'Dreaming of Google Jobs?',
    preview: 'Take a mock interview today and become a Googler',
    body: `Hi there!\n\nDreaming of landing a job at Google? Start preparing today!\n\nTake our Google Mock Interview Challenge and get:\n- Real interview questions\n- AI-powered feedback\n- Performance analytics\n\nRegister now: https://unstop.com/google-mock\n\nTeam Unstop`,
    time: '11:00 AM',
    date: 'Mar 21',
    read: true,
    starred: false,
    category: 'promotions',
  },
  {
    id: '8',
    sender: 'Team Unstop',
    email: 'noreply@unstop.com',
    subject: 'Ready for Amazon Test?',
    preview: 'Take the test, level up today!',
    body: `Hi there!\n\nReady to crack Amazon's hiring test? Practice with our curated test series.\n\nFeatures:\n- Timed practice tests\n- Topic-wise analysis\n- Leaderboard ranking\n\nStart now: https://unstop.com/amazon-test\n\nTeam Unstop`,
    time: '10:00 AM',
    date: 'Mar 21',
    read: true,
    starred: false,
    category: 'promotions',
  },
  {
    id: '9',
    sender: 'PayPal Security',
    email: 'security@paypa1-support.tk',
    subject: 'URGENT: Your account has been compromised - verify now',
    preview: 'Dear Customer, We detected unauthorized access to your PayPal account...',
    body: `Dear Customer,\n\nWe detected unauthorized access to your PayPal account. Your account has been temporarily suspended.\n\nClick here to verify your identity immediately: https://paypal-secure-verify.tk/login\n\nEnter your password and credit card to restore access.\n\nFailure to verify within 24 hours will result in permanent closure.\n\nPayPal Security Team`,
    time: '2:15 PM',
    date: 'Mar 20',
    read: false,
    starred: false,
    category: 'primary',
  },
  {
    id: '10',
    sender: 'internships',
    email: 'info@skillinfytech.com',
    subject: '4-Weeks Internship Program | SkillInfyTech IT Solutions',
    preview: 'Dear Candidate, Greetings from SkillInfyTech IT Solutions Private Limite...',
    body: `Dear Candidate,\n\nGreetings from SkillInfyTech IT Solutions Private Limited!\n\nWe are offering a 4-week internship program in the following domains:\n- Web Development\n- Data Science\n- Cybersecurity\n- Mobile App Development\n\nApply now: https://skillinfytech.com/internship\n\nRegards,\nSkillInfyTech HR Team`,
    time: '9:00 AM',
    date: 'Mar 20',
    read: true,
    starred: false,
    category: 'updates',
  },
  {
    id: '11',
    sender: 'Netflix Billing',
    email: 'billing@netflix-update.xyz',
    subject: 'Payment failed - update your billing information immediately',
    preview: 'Dear User, Your Netflix subscription payment failed. Update your payment method...',
    body: `Dear User,\n\nYour Netflix subscription payment failed. Update your payment method immediately or your account will be terminated.\n\nClick here to verify: https://netflix-billing-update.xyz/payment\n\nEnter your credit card and billing information.\n\nThis is your final warning. Failure to update within 48 hours will result in legal action.\n\nNetflix Support`,
    time: '5:30 PM',
    date: 'Mar 19',
    read: false,
    starred: false,
    category: 'primary',
  },
  {
    id: '12',
    sender: 'connect',
    email: 'noreply@connect.com',
    subject: '🚀 HackUp Registration Confirmed!',
    preview: 'Dear Team Fantastic Four, 🚀 You\'re officially in! Welcome to HackUp. We\'re thrilled to hav...',
    body: `Dear Team Fantastic Four,\n\n🚀 You're officially in! Welcome to HackUp.\n\nWe're thrilled to have you participate. Here are the next steps:\n1. Join the Discord server\n2. Submit your project idea by March 25\n3. Attend the kickoff session on March 26\n\nGood luck!\n\nHackUp Team`,
    time: '4:00 PM',
    date: 'Mar 18',
    read: true,
    starred: true,
    hasAttachment: true,
    attachmentName: 'hackup-banner....',
    category: 'primary',
  },
];
