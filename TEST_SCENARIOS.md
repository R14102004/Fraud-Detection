# Test Scenarios & Fraud Detection Examples

## 📋 Comprehensive Test Suite

This document provides detailed test scenarios to demonstrate all fraud detection capabilities.

---

## 🟢 TEST 1: Normal User - Low Risk Bidding

### Setup
- User: John Doe (Trust Score: 95)
- Current Price: $100
- Bid Amount: $120

### Expected Behavior
- Fraud Factors:
  - Trust Score: 0 (95 > 50)
  - Bid Velocity: 0 (first bid)
  - Bid Amount: 0 (120 < 500)
  - User Behavior: 0 (98% success)
  - Auction Pattern: 0 (1 bid)
  - Device Anomaly: 0
- **Total Score: 0-5**
- **Risk Level: LOW**
- **Action: ✓ ACCEPT_BID**
- **Result:** Bid accepted immediately

### Fraud Analysis Display
```
Risk Level: LOW
Fraud Score: 3/100
Factors: None (All green)
```

---

## 🟡 TEST 2: Suspicious Bot - Medium Risk Anomaly

### Setup
- User: Suspicious Bot (Trust Score: 15)
- Current Price: $100
- Bid Amount: $600 (6× current price)

### Expected Behavior
- Fraud Factors:
  - Trust Score: 70 ((50-15)×2)
  - Bid Velocity: 0 (assuming first bid)
  - Bid Amount: 15 (600 > 500)
  - User Behavior: 20 (5% success)
  - Auction Pattern: 0 (1 bid)
  - Device Anomaly: 20 (2000 bids, score 15)
- **Total Score: 125 → capped at 100**
- **Risk Level: CRITICAL**
- **Action: ✗ BLOCK_BID**
- **Result:** Bid rejected, alert broadcast

### Fraud Analysis Display
```
Risk Level: CRITICAL
Fraud Score: 100/100
Factors:
• trustScore: 70
• userBehavior: 20
• deviceAnomaly: 20
• bidAmount: 15
Recommendation: BLOCK_BID
```

---

## ⚠️ TEST 3: Velocity Attack - High Risk Rapid Bidding

### Setup
- User: Suspicious Bot (Trust Score: 15)
- Current Price: Varies
- Action: Place 5+ bids in rapid succession (< 60 seconds)

### Expected Behavior

#### Bid 1
- Fraud Factors:
  - Trust Score: 70
  - Bid Velocity: 0 (1st bid)
  - Others: 20+
- Score: ~90 → **CRITICAL (BLOCK)**
- Action: ✗ Rejected

#### If we use Jane Smith (Score: 87, Good success rate):

#### Bid 1
- Fraud Factors:
  - Trust Score: 0 (87 > 50)
  - Bid Velocity: 0 (1st bid)
  - Bid Amount: 0 (reasonable)
  - User Behavior: 0 (92% success)
  - Others: 0
- Score: 0-5 → **LOW**
- Action: ✓ Accepted

#### Bid 2 (within 60s)
- Fraud Factors:
  - Trust Score: 0
  - Bid Velocity: 3 (2 bids × 3)
  - Others: 0
- Score: 3-8 → **LOW → MEDIUM**
- Action: ✓ Accepted (flagged)

#### Bid 3 (within 60s)
- Fraud Factors:
  - Trust Score: 0
  - Bid Velocity: 9 (3 bids × 3)
  - Others: 0
- Score: 9-14 → **MEDIUM**
- Action: ✓ Accepted (flagged)

#### Bid 4 (within 60s)
- Fraud Factors:
  - Trust Score: 0
  - Bid Velocity: 12 (4 bids × 3)
  - Others: 0
- Score: 12-17 → **MEDIUM**
- Action: ✓ Accepted (flagged)

#### Bid 5 (within 60s)
- Fraud Factors:
  - Trust Score: 0
  - Bid Velocity: 15 (5 bids × 3)
  - Others: 0
- Score: 15-20 → **MEDIUM**
- Action: ✓ Accepted (flagged)

#### Bid 6 (within 60s)
- Fraud Factors:
  - Trust Score: 0
  - Bid Velocity: 18 (6 bids × 3)
  - Others: 0
- Score: 18-23 → **MEDIUM**
- Action: ✓ Accepted (flagged)

#### Bid 7 (after 60s window resets)
- Fraud Factors reset (velocity window elapsed)
- Score: 0-5 → **LOW**
- Action: ✓ Accepted

### Result
Multiple fraud alerts trigger, showing velocity attack pattern in admin dashboard.

---

## 🟠 TEST 4: Auction Pattern - High Risk Multiple Bids

### Setup
- User: Suspicious Bot (Trust Score: 15)
- Auction: "Vintage Gaming Console"
- Action: Place 11 bids on same auction

### Expected Behavior on Each Bid

#### Bids 1-10
- Fraud Factors:
  - Trust Score: 70
  - Bid Velocity: Increases (5+)
  - Auction Pattern: 0 (< 10 bids)
  - Device Anomaly: 20
- Score: 90-95 → **CRITICAL**
- Action: ✗ Blocked

#### Bid 11 (if somehow placed)
- Fraud Factors:
  - Trust Score: 70
  - Bid Velocity: 25 (capped)
  - Auction Pattern: 15 (> 10 bids)
  - Device Anomaly: 20
- Score: 100 → **CRITICAL**
- Action: ✗ Blocked

### Result
Clear pattern recognition showing fraudulent bidding concentration.

---

## 📊 TEST 5: Admin Dashboard Monitoring

### Setup
- Run multiple test scenarios
- Keep admin dashboard open

### Expected Display

#### Real-Time Alerts Section
```
[CRITICAL] FRAUD_BLOCKED
Bid from Suspicious Bot blocked due to fraud detection (Score: 100)
09:45:23 | Score: 100/100

[HIGH] SUSPICIOUS_BID  
Suspicious bid from Suspicious Bot - Score: 89.5
09:45:21 | Score: 89.5/100

[MEDIUM] SUSPICIOUS_BID
Rapid bidding detected from Jane Smith
09:45:19 | Score: 22.5/100
```

#### Risk Breakdown
```
Critical: 3 (33%)
High: 4 (44%)
Medium: 2 (22%)
Low: 0 (0%)
```

#### User Risk Scores Table
```
Name              | Trust Score | Bid Count | Suspicious Bids | Risk Level | Action
Suspicious Bot    |     15/100  |   2000    |       8         | CRITICAL   | [Block User]
Jane Smith        |     87/100  |     50    |       0         | LOW        | [View Profile]
John Doe          |     95/100  |    150    |       0         | LOW        | [View Profile]
```

---

## 🔍 TEST 6: Fraud Factor Isolation

### Individual Factor Testing

#### Test 6A: Trust Score Factor Only
- User: New User (Score: 30)
- Reasonable bid on normal auction
- Expected Score: (50-30)×2 = 40 points
- Risk: MEDIUM

#### Test 6B: Bid Velocity Factor Only
- User: John Doe (Score: 95, trusted)
- Place 6 bids in 45 seconds
- Expected Score: 6×3 = 18 points
- Risk: MEDIUM (due to velocity)

#### Test 6C: Bid Amount Factor Only
- User: John Doe (trusted)
- Current Price: $100
- Bid Amount: $600
- Expected Score: 15 points (>500 check)
- Risk: LOW-MEDIUM

#### Test 6D: User Behavior Factor Only
- Create user with 25% success rate
- Normal bid amount and velocity
- Expected Score: 20 points
- Risk: MEDIUM

#### Test 6E: Auction Pattern Factor Only
- User places 11 bids on single auction
- Other factors clean
- Expected Score: 15 points
- Risk: MEDIUM

#### Test 6F: Device Anomaly Factor Only
- High bid count (500+) + low trust score (<30)
- Other factors minimal
- Expected Score: 20 points
- Risk: MEDIUM

---

## 🧮 TEST 7: Score Calculation Verification

### Example 1: Mixed Fraud Factors
```
Setup:
- User: Suspicious Bot (Score: 15, 2000 bids)
- Current Price: $100
- Bid: $700 (in 60s window with 6 recent bids)

Calculation:
- Trust Score:      (50-15)×2 = 70
- Bid Velocity:     6×3 = 18
- Bid Amount:       15 (700 > 500)
- User Behavior:    20 (5% success)
- Auction Pattern:  0 (first on this item)
- Device Anomaly:   20 (2000 bids, 15 score)

Total: 70+18+15+20+0+20 = 143 → capped at 100
Risk Level: CRITICAL
Recommendation: BLOCK_BID ✗
```

### Example 2: Clean User
```
Setup:
- User: John Doe (Score: 95, 150 bids, 98% success)
- Current Price: $100
- Bid: $120

Calculation:
- Trust Score:      0 (95 > 50)
- Bid Velocity:     0 (first recent bid)
- Bid Amount:       0 (120 < 500)
- User Behavior:    0 (98% success)
- Auction Pattern:  0 (first on item)
- Device Anomaly:   0 (trusted user)

Total: 0
Risk Level: LOW
Recommendation: ACCEPT_BID ✓
```

---

## 📱 TEST 8: User Interface Testing

### User Bidding Interface
1. [ ] Load index.html
2. [ ] Select different users
3. [ ] View user stats update
4. [ ] See auctions load
5. [ ] Click "Place Bid"
6. [ ] Modal appears with fraud analysis
7. [ ] Enter bid amount
8. [ ] See fraud score update
9. [ ] Submit bid
10. [ ] See result (accept/block)
11. [ ] Check live alerts
12. [ ] See WebSocket updates

### Admin Dashboard
1. [ ] Load admin.html
2. [ ] View real-time stats
3. [ ] See recent alerts
4. [ ] View risk breakdown
5. [ ] Check active auctions
6. [ ] Review user risk scores
7. [ ] See updates auto-refresh
8. [ ] Try filter/search (if added)

---

## 🎯 TEST 9: Edge Cases

### Edge Case 1: Zero Trust Score
```
User: New User (Score: 0)
Expected: 50×2 = 100 points → CRITICAL
Result: All bids blocked ✗
```

### Edge Case 2: Maximum Bids
```
User places 50 bids in 60 seconds
Bid Velocity: 50×3 = 150 → capped at 25
Expected: HIGH-CRITICAL risk
Result: Alerts and blocking ✗
```

### Edge Case 3: Minimum Bid Increment
```
Current Price: $100.00
Bid Amount: $100.01 (minimum increment)
Expected: LOW risk (valid bid)
Result: ✓ Accepted
```

### Edge Case 4: Extremely High Bid
```
Current Price: $100
Bid Amount: $1,000,000
Expected: HIGH risk (anomalous)
Result: Flagged + analyzed
```

### Edge Case 5: Exact Anomaly Threshold
```
Current Price: $100
Bid Amount: $500 (exactly 5×)
Expected: No anomaly points (> check fails)
Result: Score based on other factors
```

---

## ⚡ TEST 10: Performance Testing

### Fraud Calculation Speed
```
Single Fraud Analysis:  ~10ms
10 Concurrent Bids:     ~100ms
100 Concurrent Bids:    ~1000ms
Admin Dashboard Load:    ~30ms
```

### WebSocket Broadcasting
```
1 Connected Client:     <5ms
10 Clients:            ~50ms
100 Clients:          ~200ms
```

### Database Queries
```
Get Auctions (4 items):    ~5ms
Get Users (3 items):       ~3ms
Get Alerts (50 items):    ~15ms
Dashboard Summary:        ~30ms
```

---

## 📊 Test Results Template

Use this template to document your test runs:

```
Test Date: ___________
Tester: ___________
Environment: Development/Production

TEST 1: Normal User Bidding
- User: __________
- Bid Amount: $__________
- Expected Score: __________
- Actual Score: __________
- Status: ✓ PASS / ✗ FAIL
- Notes: __________

TEST 2: Fraud Detection
- User: __________
- Attack Type: __________
- Expected Action: BLOCK/FLAG
- Actual Action: BLOCK/FLAG
- Status: ✓ PASS / ✗ FAIL
- Notes: __________

...continue for all tests...

Overall Status: ✓ PASS / ✗ FAIL
```

---

## 🔧 Debugging Tips

### Check Server Logs
```bash
# Watch for fraud analysis
node server.js | grep "fraud"

# Monitor WebSocket
node server.js | grep "WebSocket"

# Track bids
node server.js | grep "bid"
```

### Browser Console Checks
```javascript
// Check current user
console.log(currentUser)

// Check WebSocket connection
console.log(ws.readyState)
// 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED

// Check auctions loaded
console.log(auctions)

// Check alerts
console.log(alerts)
```

### Network Tab Debugging
- Monitor POST /api/bids requests
- Check response fraud analysis
- Verify WebSocket messages
- Check alert broadcasts

---

## ✅ Test Checklist

- [ ] Basic auction browsing works
- [ ] User profile switching works
- [ ] Normal bid placement works
- [ ] Fraud detection triggers correctly
- [ ] Admin dashboard loads
- [ ] Real-time alerts display
- [ ] WebSocket updates work
- [ ] Fraud scoring is accurate
- [ ] Risk levels are correct
- [ ] Bid blocking functions
- [ ] Alert broadcasting works
- [ ] UI is responsive
- [ ] Error messages display
- [ ] All features functional

---

This comprehensive test suite ensures all fraud detection capabilities work as designed.
