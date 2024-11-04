require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// API Key middleware
app.use((req, res, next) => {
const apiKey = req.header('x-api-key') || req.header('X-API-KEY');
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
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
    try {
      const { actionName, parameters, authentication, errorHandling } = req.body;
  
      // Validate required inputs
      if (!actionName || !parameters) {
        return res.status(400).json({
          error: "Missing required fields: 'actionName' and 'parameters' are required"
        });
      }
  
      // Create OpenAPI specification
      const openAPISpec = {
        openapi: "3.1.0",
        paths: {
          [`/${actionName}`]: {
            post: {
              summary: parameters.summary || "Custom action endpoint",
              operationId: actionName,
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: parameters.properties || {},
                      required: parameters.required || []
                    }
                  }
                }
              },
              responses: {
                "200": {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: parameters.responseProperties || {}
                      }
                    }
                  }
                },
                "400": {
                  description: "Bad request - missing or invalid parameters"
                },
                "401": {
                  description: "Unauthorized - invalid API key"
                },
                "500": {
                  description: "Internal server error"
                }
              }
            }
          }
        },
        components: {
          securitySchemes: {
            ApiKeyAuth: {
              type: "apiKey",
              in: "header",
              name: authentication?.headerName || "x-api-key"
            }
          }
        }
      };
  
      // Create dynamic endpoint
      app.post(`/${actionName}`, async (req, res) => {
        try {
          // Validate required parameters
          const requiredParams = parameters.required || [];
          for (const param of requiredParams) {
            if (!req.body[param]) {
              return res.status(400).json({
                error: `Missing required parameter: ${param}`,
                required: requiredParams
              });
            }
          }
  
          // Validate parameter types
          for (const [key, value] of Object.entries(req.body)) {
            const parameterSpec = parameters.properties[key];
            if (parameterSpec) {
              if (parameterSpec.type === "string" && typeof value !== "string") {
                return res.status(400).json({
                  error: `Invalid type for parameter '${key}': expected string`
                });
              }
              if (parameterSpec.type === "number" && typeof value !== "number") {
                return res.status(400).json({
                  error: `Invalid type for parameter '${key}': expected number`
                });
              }
              if (parameterSpec.enum && !parameterSpec.enum.includes(value)) {
                return res.status(400).json({
                  error: `Invalid value for parameter '${key}': must be one of ${parameterSpec.enum.join(", ")}`
                });
              }
            }
          }
  
          // Process the request
          const response = {
            success: true,
            data: {
              ...req.body,
              processedAt: new Date().toISOString()
            },
            metadata: {
              endpoint: actionName,
              requestId: require('crypto').randomUUID()
            }
          };
  
          res.json(response);
  
        } catch (error) {
          console.error(`Error in /${actionName}:`, error);
          res.status(500).json({
            error: "Internal server error",
            message: error.message,
            endpoint: actionName
          });
        }
      });
  
      // Return the complete specification
      res.json({
        actionSpecification: {
          customAction: {
            openAPISpec: openAPISpec
          },
          apiEndpoint: {
            endpoint: `/${actionName}`,
            method: "POST",
            parameters: parameters,
            authentication: {
              type: authentication?.type || "apiKey",
              headerName: authentication?.headerName || "x-api-key"
            },
            errorHandling: {
              strategies: errorHandling?.strategies || [
                "Parameter validation",
                "Type checking",
                "Required fields validation",
                "Error logging",
                "Detailed error responses"
              ]
            }
          },
          usage: {
            curl: `curl -X POST http://your-server/${actionName} \
                   -H "Content-Type: application/json" \
                   -H "x-api-key: your-api-key" \
                   -d '${JSON.stringify({ example: "data" })}'`,
            postman: {
              method: "POST",
              url: `http://your-server/${actionName}`,
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "your-api-key"
              },
              body: {
                mode: "raw",
                raw: JSON.stringify({ example: "data" })
              }
            }
          }
        }
      });
  
    } catch (error) {
      console.error("Error in /designCustomActions:", error);
      res.status(500).json({
        error: "Failed to design custom action",
        message: error.message
      });
    }
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

// GPT Architect Configuration endpoint
app.post('/createGPTArchitect', (req, res) => {
    const { name, description, coreFunctions, processSteps, responseGuidelines } = req.body;
  
    const gptArchitectConfig = {
      configuration: {
        name: "GPT Architect",
        description: "Expert assistant for creating custom GPTs",
        instructions: {
          role: "You are GPT Architect, specializing in helping users create custom GPTs.",
          coreFunctions: [
            "Architecture framework development",
            "System prompt engineering",
            "Custom actions design",
            "Implementation guidance",
            "Testing and optimization support"
          ],
          processSteps: [
            "Requirements gathering",
            "Architecture design",
            "Implementation planning",
            "Testing setup",
            "Optimization guidance"
          ],
          responseGuidelines: [
            "Start with understanding requirements",
            "Provide structured responses",
            "Include specific examples",
            "Offer clear guidance",
            "Follow up on implementation"
          ],
          limitations: [
            "No direct code execution",
            "Platform restrictions apply",
            "API limits consideration"
          ]
        },
        conversationStarters: [
          "I'll help you create a custom GPT. What's your main goal?",
          "Let's design your GPT architecture. What functionality do you need?",
          "Ready to optimize your GPT. What aspects need improvement?"
        ]
      }
    };
  
    res.json(gptArchitectConfig);
  });


// Knowledge Base Structure endpoint
app.post('/createKnowledgeBase', (req, res) => {
    const { technical, functional, operational } = req.body;
  
    const knowledgeBase = {
      knowledgeBase: {
        domains: {
          technical: {
            apiDocumentation: technical?.apiDocumentation || [
              "API endpoints documentation",
              "Authentication methods",
              "Request/response formats"
            ],
            implementationGuides: technical?.implementationGuides || [
              "Setup procedures",
              "Configuration steps",
              "Integration guidelines"
            ],
            bestPractices: technical?.bestPractices || [
              "Security measures",
              "Performance optimization",
              "Error handling"
            ]
          },
          functional: {
            useCase: functional?.useCase || [
              "Common scenarios",
              "Implementation examples",
              "Use case patterns"
            ],
            features: functional?.features || [
              "Core capabilities",
              "Advanced features",
              "Integration options"
            ],
            limitations: functional?.limitations || [
              "Platform restrictions",
              "API limits",
              "Technical constraints"
            ]
          },
          operational: {
            maintenance: operational?.maintenance || [
              "Regular updates",
              "Monitoring procedures",
              "Backup strategies"
            ],
            troubleshooting: operational?.troubleshooting || [
              "Common issues",
              "Debug procedures",
              "Solution guides"
            ],
            optimization: operational?.optimization || [
              "Performance tuning",
              "Resource optimization",
              "Scaling strategies"
            ]
          }
        },
        resources: {
          templates: [
            "Configuration templates",
            "Implementation guides",
            "Testing protocols"
          ],
          examples: [
            "Code samples",
            "Use case examples",
            "Integration patterns"
          ],
          tutorials: [
            "Getting started",
            "Advanced implementation",
            "Best practices"
          ]
        },
        updates: {
          changelog: [
            "Version history",
            "Feature updates",
            "Bug fixes"
          ],
          versionNotes: [
            "Release notes",
            "Compatibility updates",
            "Migration guides"
          ],
          improvements: [
            "Performance enhancements",
            "Feature additions",
            "Security updates"
          ]
        }
      }
    };
  
    res.json(knowledgeBase);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});