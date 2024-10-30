require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Generate Architecture endpoint
app.post('/generateArchitecture', (req, res) => {
  const { gptPurpose, targetUsers, coreFeatures } = req.body;
  res.json({
    framework: {
      purpose: gptPurpose,
      users: targetUsers,
      features: coreFeatures
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});