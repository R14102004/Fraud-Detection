# 🏆 Auction Platform with Fraud Detection

A comprehensive real-time auction platform featuring advanced fraud detection, admin dashboard, live alerts, and user bidding system.

## Features

### 🎯 User Bidding Platform
- Browse active auctions with real-time updates
- Place bids with instant validation
- View fraud analysis for each bid
- Switch between trusted and suspicious user accounts
- Live fraud alert notifications

### 🛡️ Advanced Fraud Detection Engine
- **Multi-factor Fraud Scoring** (0-100):
  - Trust Score Analysis
  - Bid Velocity Detection
  - Bid Amount Anomaly Detection
  - User Behavior Pattern Analysis
  - Auction Pattern Recognition
  - Device/IP Anomaly Detection

- **Risk Levels**:
  - 🟢 LOW (0-25): Safe to proceed
  - 🟡 MEDIUM (25-50): Monitor closely
  - 🟠 HIGH (50-75): Review required
  - 🔴 CRITICAL (75-100): Block automatically

### 📊 Admin Dashboard
- Real-time fraud monitoring
- Active auction tracking
- User risk assessment
- Alert management
- Fraud statistics and trends
- Risk breakdown visualization

### 🔔 Real-Time Alerts
- WebSocket-based live notifications
- Instant alert updates across all clients
- Severity-based alert filtering
- Bid rejection alerts
- Fraud score tracking

## Project Structure

```
Fraud Detection/
├── index.html          # User auction interface
├── admin.html          # Admin dashboard
├── server.js           # Node.js backend with fraud engine
├── package.json        # Dependencies
└── README.md          # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

### Step 3: Access the Application

**User Interface:**
- Navigate to `http://localhost:3000` in your browser

**Admin Dashboard:**
- Click "📊 Admin Dashboard" or visit `http://localhost:3000/admin.html`

## How to Use

### For Regular Users

1. **Select a User Profile**
   - Choose between trusted users or a suspicious bot account
   - Trusted users: John Doe, Jane Smith (High trust scores)
   - Suspicious account: Fraud Bot (Low trust, high bid velocity)

2. **Browse Auctions**
   - View active auctions with current prices
   - See remaining time and bid counts
   - Click "Place Bid" to participate

3. **Place a Bid**
   - Enter an amount higher than current price
   - System analyzes fraud risk
   - View fraud score and recommendation
   - Bid is either accepted or blocked based on fraud analysis

4. **Monitor Live Alerts**
   - See real-time fraud alerts at the top of the page
   - Alerts update instantly via WebSocket
   - Each alert shows severity, score, and timestamp

### For Administrators

1. **Dashboard Overview**
   - View key metrics (total auctions, active bids, alerts)
   - Monitor system status

2. **Recent Alerts**
   - Review flagged bids in real-time
   - See fraud analysis details
   - Take action on suspicious activities

3. **User Risk Scores**
   - Monitor user trust scores
   - Track suspicious bid patterns
   - Block high-risk users

4. **Active Auctions**
   - Oversee all running auctions
   - Monitor bid activity
   - Track auction progress

## Fraud Detection Algorithm

The system analyzes each bid against 6 key factors:

### 1. Trust Score Factor
- Users with trust scores < 50 increase fraud risk
- Calculation: `(50 - trustScore) × 2`

### 2. Bid Velocity
- Rapid bidding pattern detection
- Detects > 5 bids in 60 seconds
- Calculation: `recentBids × 3 (max 25)`

### 3. Bid Amount Anomaly
- Detects unusually high bids
- Triggers if bid > 5× current price
- Adds 15 points to fraud score

### 4. User Behavior
- Success rate analysis
- Users with < 30% success rate flagged
- Adds 20 points if suspicious

### 5. Auction Pattern
- Detects excessive bidding on single auction
- Triggers if > 10 bids from same user
- Adds 15 points

### 6. Device/IP Anomaly
- High bid count + low trust score
- Indicates potential bot activity
- Adds 20 points

### Fraud Recommendations
- **ACCEPT_BID**: Score 0-25 (Low risk)
- **MONITOR_BID**: Score 25-50 (Medium risk)
- **REVIEW_BID**: Score 50-75 (High risk - needs review)
- **BLOCK_BID**: Score 75-100 (Critical - automatic block)

## API Endpoints

### Auctions
```
GET  /api/auctions                 # Get all active auctions
GET  /api/auctions/:id             # Get specific auction
POST /api/bids                      # Place a bid
```

### Users
```
GET  /api/users/:id                # Get user profile with stats
GET  /api/admin/users              # Get all users with fraud data
```

### Alerts
```
GET  /api/alerts?limit=50          # Get recent fraud alerts
```

### Admin
```
GET  /api/admin/dashboard          # Get dashboard data
```

## Sample Data

### Pre-loaded Users
1. **John Doe** (user1)
   - Trust Score: 95
   - Bids: 150
   - Status: ✓ Trusted

2. **Jane Smith** (user2)
   - Trust Score: 87
   - Bids: 45
   - Status: ✓ Trusted

3. **Suspicious Bot** (fraud_bot)
   - Trust Score: 15
   - Bids: 2000
   - Status: ⚠️ High Risk (Perfect for testing fraud detection)

### Pre-loaded Auctions
- Vintage Gaming Console ($250)
- Antique Watch ($500)
- Modern Laptop ($800)
- Art Print Collection ($150)

## Testing Fraud Detection

### Test Case 1: High Trust User (Low Risk)
1. Select "John Doe"
2. Place a normal bid
3. Bid accepted immediately ✓

### Test Case 2: Rapid Bidding (High Risk)
1. Select "Suspicious Bot"
2. Quickly place multiple bids (5+ in 60 seconds)
3. Bids get flagged with high fraud score
4. Eventually blocked at 75+ score ✗

### Test Case 3: Anomalous Bid Amount
1. Select any user
2. Place a bid 5× higher than current price
3. System flags as anomalous
4. Bid may be blocked depending on user profile

## WebSocket Real-Time Features

The system uses WebSocket for:
- **Live bid updates**: All clients receive updates instantly
- **Real-time alerts**: Fraud alerts broadcast to connected clients
- **Auction updates**: Price changes reflected immediately
- **User subscriptions**: Each user receives relevant notifications

## Performance Features

- **Real-time Updates**: 5-second auto-refresh
- **WebSocket Broadcasting**: Instant alert dissemination
- **Efficient Bid Processing**: < 100ms fraud analysis
- **Scalable Architecture**: Handles multiple concurrent users

## Security Considerations

1. **Fraud Prevention**: Multi-factor fraud scoring
2. **Rate Limiting**: Bid velocity checks
3. **Amount Validation**: Anomaly detection
4. **User Reputation**: Trust score system
5. **Alert System**: Real-time suspicious activity tracking

## Future Enhancements

- [ ] Machine learning fraud prediction
- [ ] Advanced behavioral analysis
- [ ] Geographic location tracking
- [ ] Device fingerprinting
- [ ] Transaction history analysis
- [ ] Manual review workflow
- [ ] Detailed audit logs
- [ ] Export reports functionality

## Troubleshooting

### Server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### WebSocket connection failed
- Ensure server is running on port 3000
- Check browser console for errors
- Verify firewall settings

### Bids not appearing in admin dashboard
- Refresh the page (Cmd/Ctrl + R)
- Check that WebSocket is connected
- Verify API endpoints are accessible

## License

This project is provided as-is for educational and demonstration purposes.

## Support

For issues or questions, please refer to the API documentation in `server.js` or check the browser console for detailed error messages.

---

**Created:** February 2026
**Version:** 1.0.0
