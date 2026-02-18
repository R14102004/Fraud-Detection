const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory database
const auctions = new Map();
const users = new Map();
const bids = new Map();
const alerts = [];
let ws_clients = [];

// Initialize sample users
users.set('user1', {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  trustScore: 95,
  bidCount: 150,
  successRate: 98,
  riskLevel: 'LOW'
});

users.set('user2', {
  id: 'user2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  trustScore: 87,
  bidCount: 45,
  successRate: 92,
  riskLevel: 'LOW'
});

users.set('fraud_bot', {
  id: 'fraud_bot',
  name: 'Suspicious Bot',
  email: 'bot@fake.com',
  trustScore: 15,
  bidCount: 2000,
  successRate: 5,
  riskLevel: 'CRITICAL'
});

// Fraud Detection Engine
class FraudDetector {
  static calculateFraudScore(bid, user, auction) {
    let score = 0;
    const factors = {
      trustScore: 0,
      bidVelocity: 0,
      bidAmount: 0,
      userBehavior: 0,
      auctionPattern: 0,
      deviceAnomaly: 0
    };

    // Trust score factor (lower trust = higher fraud risk)
    if (user.trustScore < 50) {
      factors.trustScore = (50 - user.trustScore) * 2;
      score += factors.trustScore;
    }

    // Bid velocity (rapid bidding pattern)
    const recentBids = Array.from(bids.values()).filter(
      b => b.userId === user.id && Date.now() - b.timestamp < 60000
    );
    if (recentBids.length > 5) {
      factors.bidVelocity = Math.min(recentBids.length * 3, 25);
      score += factors.bidVelocity;
    }

    // Bid amount anomaly
    if (bid.amount > auction.currentPrice * 5) {
      factors.bidAmount = 15;
      score += factors.bidAmount;
    }

    // User behavior pattern
    if (user.successRate < 30) {
      factors.userBehavior = 20;
      score += factors.userBehavior;
    }

    // Auction pattern detection (too many high bids from same user)
    const userBidsOnAuction = Array.from(bids.values()).filter(
      b => b.auctionId === auction.id && b.userId === user.id
    ).length;
    if (userBidsOnAuction > 10) {
      factors.auctionPattern = 15;
      score += factors.auctionPattern;
    }

    // Device/IP anomaly simulation
    if (user.bidCount > 500 && user.trustScore < 30) {
      factors.deviceAnomaly = 20;
      score += factors.deviceAnomaly;
    }

    return {
      totalScore: Math.min(score, 100),
      factors,
      riskLevel: this.getRiskLevel(Math.min(score, 100)),
      recommendation: this.getRecommendation(Math.min(score, 100))
    };
  }

  static getRiskLevel(score) {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
  }

  static getRecommendation(score) {
    if (score >= 75) return 'BLOCK_BID';
    if (score >= 50) return 'REVIEW_BID';
    if (score >= 25) return 'MONITOR_BID';
    return 'ACCEPT_BID';
  }
}

// Create sample auctions
function initializeAuctions() {
  const auctionIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  
  auctions.set(auctionIds[0], {
    id: auctionIds[0],
    title: 'Vintage Gaming Console',
    description: 'Rare original Nintendo console in excellent condition',
    currentPrice: 250,
    startingPrice: 100,
    endTime: Date.now() + 3600000,
    seller: 'admin',
    highestBidder: null,
    category: 'Electronics',
    status: 'ACTIVE',
    bidsCount: 0
  });

  auctions.set(auctionIds[1], {
    id: auctionIds[1],
    title: 'Antique Watch',
    description: 'Swiss-made pocket watch from 1920s',
    currentPrice: 500,
    startingPrice: 200,
    endTime: Date.now() + 7200000,
    seller: 'admin',
    highestBidder: null,
    category: 'Collectibles',
    status: 'ACTIVE',
    bidsCount: 0
  });

  auctions.set(auctionIds[2], {
    id: auctionIds[2],
    title: 'Modern Laptop',
    description: 'Latest model laptop, brand new',
    currentPrice: 800,
    startingPrice: 600,
    endTime: Date.now() + 5400000,
    seller: 'admin',
    highestBidder: null,
    category: 'Electronics',
    status: 'ACTIVE',
    bidsCount: 0
  });

  auctions.set(auctionIds[3], {
    id: auctionIds[3],
    title: 'Art Print Collection',
    description: 'Set of 5 limited edition prints',
    currentPrice: 150,
    startingPrice: 50,
    endTime: Date.now() + 2700000,
    seller: 'admin',
    highestBidder: null,
    category: 'Art',
    status: 'ACTIVE',
    bidsCount: 0
  });
}

// WebSocket connections
wss.on('connection', (ws) => {
  ws_clients.push(ws);
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleWebSocketMessage(data, ws);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    ws_clients = ws_clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

function broadcast(message) {
  ws_clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleWebSocketMessage(data, ws) {
  if (data.type === 'SUBSCRIBE') {
    ws.userId = data.userId;
    const message = {
      type: 'SUBSCRIBED',
      userId: data.userId,
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(message));
  }
}

// REST API Routes

// Get all auctions
app.get('/api/auctions', (req, res) => {
  const auctionList = Array.from(auctions.values()).map(auction => ({
    ...auction,
    timeRemaining: Math.max(0, auction.endTime - Date.now())
  }));
  res.json(auctionList);
});

// Get auction details
app.get('/api/auctions/:id', (req, res) => {
  const auction = auctions.get(req.params.id);
  if (!auction) {
    return res.status(404).json({ error: 'Auction not found' });
  }
  res.json({
    ...auction,
    timeRemaining: Math.max(0, auction.endTime - Date.now())
  });
});

// Place bid
app.post('/api/bids', (req, res) => {
  const { auctionId, userId, amount } = req.body;

  const auction = auctions.get(auctionId);
  if (!auction) {
    return res.status(404).json({ error: 'Auction not found' });
  }

  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate bid amount
  if (amount <= auction.currentPrice) {
    return res.status(400).json({ error: 'Bid must be higher than current price' });
  }

  // Run fraud detection
  const fraudAnalysis = FraudDetector.calculateFraudScore({ amount }, user, auction);

  const bidId = uuidv4();
  const bid = {
    id: bidId,
    auctionId,
    userId,
    amount,
    timestamp: Date.now(),
    fraudScore: fraudAnalysis.totalScore,
    riskLevel: fraudAnalysis.riskLevel
  };

  // Block critical fraud bids
  if (fraudAnalysis.recommendation === 'BLOCK_BID') {
    const alert = {
      id: uuidv4(),
      type: 'FRAUD_BLOCKED',
      severity: 'CRITICAL',
      message: `Bid from ${user.name} blocked due to fraud detection (Score: ${fraudAnalysis.totalScore})`,
      bidId,
      userId,
      auctionId,
      timestamp: Date.now(),
      fraudAnalysis
    };
    alerts.push(alert);
    broadcast({ type: 'ALERT', alert });
    return res.status(403).json({ error: 'Bid rejected due to fraud detection', fraudAnalysis });
  }

  // Accept but monitor flagged bids
  if (fraudAnalysis.recommendation === 'REVIEW_BID' || fraudAnalysis.recommendation === 'MONITOR_BID') {
    const alert = {
      id: uuidv4(),
      type: 'SUSPICIOUS_BID',
      severity: fraudAnalysis.riskLevel,
      message: `Suspicious bid from ${user.name} - Score: ${fraudAnalysis.totalScore}`,
      bidId,
      userId,
      auctionId,
      timestamp: Date.now(),
      fraudAnalysis
    };
    alerts.push(alert);
    broadcast({ type: 'ALERT', alert });
  }

  bids.set(bidId, bid);
  auction.currentPrice = amount;
  auction.highestBidder = userId;
  auction.bidsCount = (auction.bidsCount || 0) + 1;

  // Update user stats
  user.bidCount = (user.bidCount || 0) + 1;

  const response = {
    success: true,
    bid,
    auction: {
      id: auction.id,
      currentPrice: auction.currentPrice,
      highestBidder: auction.highestBidder,
      bidsCount: auction.bidsCount
    },
    fraudAnalysis
  };

  broadcast({
    type: 'BID_PLACED',
    auction: response.auction,
    message: `New bid on ${auction.title}: $${amount}`
  });

  res.json(response);
});

// Get fraud alerts
app.get('/api/alerts', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const alertList = alerts.slice(-limit).reverse();
  res.json(alertList);
});

// Get user profile and fraud risk
app.get('/api/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userBids = Array.from(bids.values()).filter(b => b.userId === req.params.id);
  const avgFraudScore = userBids.length > 0
    ? userBids.reduce((sum, b) => sum + b.fraudScore, 0) / userBids.length
    : 0;

  res.json({
    ...user,
    bidHistory: userBids.slice(-10),
    averageFraudScore: avgFraudScore,
    recentBidCount: userBids.filter(b => Date.now() - b.timestamp < 3600000).length
  });
});

// Get all users (admin endpoint)
app.get('/api/admin/users', (req, res) => {
  const usersList = Array.from(users.values()).map(user => {
    const userBids = Array.from(bids.values()).filter(b => b.userId === user.id);
    const avgFraudScore = userBids.length > 0
      ? userBids.reduce((sum, b) => sum + b.fraudScore, 0) / userBids.length
      : 0;
    return {
      ...user,
      totalBids: userBids.length,
      averageFraudScore: avgFraudScore,
      suspiciousBids: userBids.filter(b => b.riskLevel !== 'LOW').length
    };
  });
  res.json(usersList);
});

// Get admin dashboard data
app.get('/api/admin/dashboard', (req, res) => {
  const totalAuctions = auctions.size;
  const activeAuctions = Array.from(auctions.values()).filter(a => a.status === 'ACTIVE').length;
  const totalBids = bids.size;
  const fraudAlerts = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH');
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');

  const recentAlerts = alerts.slice(-10).reverse();

  res.json({
    summary: {
      totalAuctions,
      activeAuctions,
      totalBids,
      totalAlerts: alerts.length,
      criticalAlerts: criticalAlerts.length,
      highRiskAlerts: fraudAlerts.length
    },
    recentAlerts,
    auctions: Array.from(auctions.values()),
    users: Array.from(users.values()).map(u => {
      const userBids = Array.from(bids.values()).filter(b => b.userId === u.id);
      const avgScore = userBids.length > 0
        ? userBids.reduce((sum, b) => sum + b.fraudScore, 0) / userBids.length
        : 0;
      return { ...u, averageFraudScore: avgScore, bidCount: userBids.length };
    })
  });
});

// Initialize data on start
initializeAuctions();

server.listen(PORT, () => {
  console.log(`Auction platform running at http://localhost:${PORT}`);
  console.log(`Admin dashboard at http://localhost:${PORT}/admin.html`);
});
