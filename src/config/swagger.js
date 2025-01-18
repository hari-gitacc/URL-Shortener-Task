const swaggerJSDoc = require("swagger-jsdoc");
const baseUrl = process.env.BASE_URL ;


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
            description: 'Advanced URL Shortener with Analytics and Google Authentication',
            contact: {
                name: 'API Support',
                email: 'hari.dev@zohomail.in'
            }
        },
        servers: [
            {
                url: baseUrl,
                
              }
        ],
        tags: [
            {
                name: 'URLs',
                description: 'URL shortening operations'
            },
            {
                name: 'Analytics',
                description: 'URL analytics and statistics'
            },
            {
                name: 'Auth',
                description: 'Authentication endpoints'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                AnalyticsResponse: {
                    type: 'object',
                    properties: {
                        totalClicks: {
                            type: 'number',
                            example: 150
                        },
                        uniqueUsers: {
                            type: 'number',
                            example: 75
                        },
                        clicksByDate: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: {
                                        type: 'string',
                                        example: '2025-01-15'
                                    },
                                    clicks: {
                                        type: 'number',
                                        example: 25
                                    }
                                }
                            }
                        },
                        osType: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    osName: {
                                        type: 'string',
                                        example: 'Windows'
                                    },
                                    uniqueClicks: {
                                        type: 'number',
                                        example: 50
                                    },
                                    uniqueUsers: {
                                        type: 'number',
                                        example: 30
                                    }
                                }
                            }
                        },
                        deviceType: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    deviceName: {
                                        type: 'string',
                                        example: 'desktop'
                                    },
                                    uniqueClicks: {
                                        type: 'number',
                                        example: 40
                                    },
                                    uniqueUsers: {
                                        type: 'number',
                                        example: 20
                                    }
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'URL not found'
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js'] 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
