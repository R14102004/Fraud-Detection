#!/usr/bin/env node

/**
 * 🏆 AUCTION PLATFORM - QUICK START GUIDE
 * 
 * This guide will help you get the auction platform with fraud detection running in 2 minutes.
 */

console.clear();
console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║         🏆 AUCTION PLATFORM WITH FRAUD DETECTION - QUICK START 🛡️        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

📋 QUICK SETUP (2 Minutes):

1️⃣  INSTALL DEPENDENCIES
   $ npm install

2️⃣  START THE SERVER
   $ npm start

3️⃣  OPEN IN BROWSER
   • User Interface: http://localhost:3000
   • Admin Dashboard: http://localhost:3000/admin.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 FEATURES INCLUDED:

✓ Real-time Auction Platform
✓ Advanced Fraud Detection Engine (6-factor analysis)
✓ Admin Dashboard with Live Monitoring
✓ WebSocket Real-time Alerts
✓ User Bidding Interface
✓ Risk Scoring System
✓ Fraud Analytics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DEFAULT USERS (For Testing):

👤 John Doe (Trusted)
   • Trust Score: 95/100
   • Status: ✓ SAFE
   • Perfect for normal bidding

👤 Jane Smith (Trusted)
   • Trust Score: 87/100
   • Status: ✓ SAFE
   • Good for auction participation

⚠️  Suspicious Bot (High Risk)
   • Trust Score: 15/100
   • Bid Count: 2000
   • Status: 🔴 CRITICAL
   • Great for testing fraud detection!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎪 SAMPLE AUCTIONS:

1. Vintage Gaming Console - Starting at $100
2. Antique Watch - Starting at $200
3. Modern Laptop - Starting at $600
4. Art Print Collection - Starting at $50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTING FRAUD DETECTION:

TEST 1: Place Normal Bid (Low Risk)
├─ Select: John Doe
├─ Bid Amount: Current Price + $10
└─ Result: ✓ Accepted (Score: <25)

TEST 2: Rapid Bidding (High Risk)
├─ Select: Suspicious Bot
├─ Place 5+ bids in 60 seconds
└─ Result: 🔴 Blocked (Score: >75)

TEST 3: Anomalous Amount (Risk Alert)
├─ Select: Any User
├─ Bid Amount: Current Price × 5
└─ Result: ⚠️  Flagged (Score: 15-30)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 FRAUD DETECTION ALGORITHM:

The system analyzes 6 key factors:

1. Trust Score        ─────→ User reputation
2. Bid Velocity       ─────→ Rapid bidding patterns
3. Bid Amount         ─────→ Anomalous amounts
4. User Behavior      ─────→ Success rate
5. Auction Pattern    ─────→ Multiple bids on same item
6. Device Anomaly     ─────→ Bot detection

Result: Fraud Score (0-100)

RISK LEVELS:
🟢 0-25   = LOW        ✓ Bid Accepted
🟡 25-50  = MEDIUM     ⚠️  Monitor
🟠 50-75  = HIGH       ⚠️  Review Required
🔴 75-100 = CRITICAL   ✗ Bid Blocked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 API ENDPOINTS:

GET  /api/auctions              ─ List all auctions
GET  /api/auctions/:id          ─ Get auction details
POST /api/bids                  ─ Place a bid
GET  /api/users/:id             ─ Get user profile
GET  /api/alerts                ─ Get fraud alerts
GET  /api/admin/dashboard       ─ Admin dashboard data

WebSocket: ws://localhost:3000  ─ Real-time updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 USER INTERFACE FEATURES:

✓ Real-time auction browser
✓ Live fraud alert feed
✓ User profile selector
✓ Bid placement with fraud analysis
✓ Risk score visualization
✓ WebSocket real-time updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ADMIN DASHBOARD FEATURES:

✓ Key metrics (auctions, bids, alerts)
✓ Real-time alert monitoring
✓ Risk breakdown visualization
✓ Active auction tracking
✓ User risk assessment
✓ Fraud statistics
✓ Block/monitor user actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT STEPS:

1. Install: npm install
2. Start:   npm start
3. Visit:   http://localhost:3000
4. Test:    Try placing bids with different users
5. Monitor: Check admin dashboard for alerts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 FOR MORE INFO:
   See README.md for detailed documentation
   Check server.js for API implementation
   Review fraud detection algorithm in server.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS:

• The "Suspicious Bot" account is great for testing fraud detection
• Try placing rapid bids to trigger velocity alerts
• Check the admin dashboard for real-time fraud statistics
• WebSocket updates happen in real-time - no page refresh needed
• Fraud scores are recalculated for every bid attempt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️  TROUBLESHOOTING:

Port 3000 in use?
  $ npm start -- --port 3001

Server not responding?
  Check: npm install ran successfully
  Check: Node.js version >= 14
  Check: Port 3000 is available

WebSocket not connecting?
  Check: Server is running
  Check: Browser console for errors
  Check: Firewall allows WebSocket connections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to go! 🚀

Run: npm install && npm start

Then visit: http://localhost:3000

╚═══════════════════════════════════════════════════════════════════════════╝
`);
