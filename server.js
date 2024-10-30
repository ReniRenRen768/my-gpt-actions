require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// API Key middleware
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

// Generate Architecture endpoint
app.post('/generateArchitecture', (req, res) => {
  const { gptPurpose, targetUsers, coreFeatures, integrationNeeds } = req.body;
  res.json({
    framework: {
      systemComponents: {
        purpose: gptPurpose,
        users: targetUsers,
        features: coreFeatures,
        integrations: integrationNeeds
      }
    }
  });
});

// Create System Prompt endpoint
app.post('/createSystemPrompt', (req, res) => {
  const { role, expertise, constraints, conversationStyle } = req.body;
  res.json({
    systemPrompt: {
      role: role,
      expertise: expertise,
      constraints: constraints,
      style: conversationStyle
    }
  });
});

// Design Custom Actions endpoint
app.post('/designCustomActions', (req, res) => {
  const { actionName, parameters, authentication, errorHandling } = req.body;
  res.json({
    actionSpecification: {
      name: actionName,
      parameters: parameters,
      auth: authentication,
      errorHandling: errorHandling
    }
  });
});

// Troubleshoot API endpoint
app.post('/troubleshootAPI', (req, res) => {
  const { errorType, context, requestDetails } = req.body;
  res.json({
    troubleshooting: {
      error: errorType,
      context: context,
      request: requestDetails,
      suggestions: ['Check authentication', 'Verify parameters', 'Review logs']
    }
  });
});

// Optimize Performance endpoint
app.post('/optimizePerformance', (req, res) => {
  const { currentMetrics, bottlenecks, optimizationGoals } = req.body;
  res.json({
    optimization: {
      current: currentMetrics,
      bottlenecks: bottlenecks,
      goals: optimizationGoals,
      recommendations: ['Implement caching', 'Add rate limiting', 'Optimize queries']
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});