import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Parking System API",
      version: "1.0.0",
      description:
        "API documentation for the Vehicle Parking System backend. This system manages vehicle registration, admin authentication, and parking sticker uploads.",
      contact: {
        name: "API Support",
        email: "support@parkingsystem.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Base URL",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication",
        },
      },
      schemas: {
        AdminLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Admin email address",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "Admin password",
              example: "password123",
            },
          },
        },
        AdminCreate: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "Admin name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "Admin email address",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "Admin password",
              example: "password123",
            },
          },
        },
        AdminResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "507f1f77bcf86cd799439011",
                },
                name: {
                  type: "string",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  example: "admin@example.com",
                },
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
        Vehicle: {
          type: "object",
          required: [
            "name",
            "ownerName",
            "regNo",
            "type",
            "roomNo",
            "bldgName",
            "contact",
            "stickerImgURL",
          ],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Vehicle name",
              example: "Honda City",
            },
            ownerName: {
              type: "string",
              description: "Owner's name",
              example: "John Doe",
            },
            regNo: {
              type: "string",
              description: "Vehicle registration number",
              example: "KA-01-AB-1234",
            },
            type: {
              type: "string",
              description: "Vehicle type",
              enum: ["car", "bike", "scooter"],
              example: "car",
            },
            roomNo: {
              type: "string",
              description: "Room number",
              example: "101",
            },
            bldgName: {
              type: "string",
              description: "Building name",
              example: "Building A",
            },
            contact: {
              type: "string",
              description: "Mobile Number",
              example: 9123456780,
            },
            stickerImgURL: {
              type: "string",
              format: "uri",
              description: "URL of the parking sticker image",
              example: "https://storage.googleapis.com/bucket/image.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        VehicleList: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Vehicles retrieved successfully",
            },
            data: {
              type: "object",
              properties: {
                vehicles: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Vehicle",
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: {
                      type: "integer",
                      example: 1,
                    },
                    limit: {
                      type: "integer",
                      example: 10,
                    },
                    total: {
                      type: "integer",
                      example: 50,
                    },
                    pages: {
                      type: "integer",
                      example: 5,
                    },
                  },
                },
              },
            },
          },
        },
        VehicleResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Vehicle created successfully",
            },
            data: {
              $ref: "#/components/schemas/Vehicle",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        NotFoundError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Vehicle not found",
            },
          },
        },
        UnauthorizedError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Unauthorized: No token provided",
            },
          },
        },
      },
    },
    paths: {
      "/admin/login": {
        post: {
          tags: ["Admin"],
          summary: "Admin login",
          description: "Authenticate admin and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminLogin",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AdminResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid credentials or missing fields",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/admin/create": {
        post: {
          tags: ["Admin"],
          summary: "Create new admin",
          description: "Register a new admin user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminCreate",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Admin created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AdminResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid input or email already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/vehicles": {
        get: {
          tags: ["Vehicles"],
          summary: "Get all vehicles",
          description: "Retrieve a paginated list of all vehicles",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Page number for pagination (default: 1)",
              schema: {
                type: "integer",
                default: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Number of vehicles per page (default: 10)",
              schema: {
                type: "integer",
                default: 10,
              },
            },
          ],
          responses: {
            200: {
              description: "Vehicles retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/VehicleList",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - No token provided",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UnauthorizedError",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/vehicles/{id}": {
        get: {
          tags: ["Vehicles"],
          summary: "Get vehicle by ID",
          description: "Retrieve a specific vehicle by its ID",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Vehicle ID (MongoDB ObjectId)",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Vehicle retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/VehicleResponse",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - No token provided",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UnauthorizedError",
                  },
                },
              },
            },
            404: {
              description: "Vehicle not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/NotFoundError",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/vehicles/create": {
        post: {
          tags: ["Vehicles"],
          summary: "Create new vehicle",
          description:
            "Create a new vehicle with sticker image upload (multipart/form-data)",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: [
                    "name",
                    "ownerName",
                    "regNo",
                    "type",
                    "roomNo",
                    "bldgName",
                    "contact",
                    "file",
                  ],
                  properties: {
                    name: {
                      type: "string",
                      description: "Vehicle name",
                      example: "Honda City",
                    },
                    ownerName: {
                      type: "string",
                      description: "Owner's name",
                      example: "John Doe",
                    },
                    regNo: {
                      type: "string",
                      description: "Vehicle registration number",
                      example: "KA-01-AB-1234",
                    },
                    type: {
                      type: "string",
                      description: "Vehicle type",
                      enum: ["car", "bike", "scooter"],
                      example: "car",
                    },
                    roomNo: {
                      type: "string",
                      description: "Room number",
                      example: "101",
                    },
                    bldgName: {
                      type: "string",
                      description: "Building name",
                      example: "Building A",
                    },
                    contact: {
                      type: "string",
                      description: "Mobile Number",
                      example: 9123456780,
                    },
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Sticker image file (JPEG, PNG, etc.)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Vehicle created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/VehicleResponse",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - No token provided",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UnauthorizedError",
                  },
                },
              },
            },
            400: {
              description: "Invalid input or missing required fields",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/vehicles/update/{id}": {
        post: {
          tags: ["Vehicles"],
          summary: "Update vehicle",
          description: "Update vehicle details and/or sticker image",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Vehicle ID (MongoDB ObjectId)",
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Vehicle name",
                      example: "Honda City",
                    },
                    ownerName: {
                      type: "string",
                      description: "Owner's name",
                      example: "John Doe",
                    },
                    regNo: {
                      type: "string",
                      description: "Vehicle registration number",
                      example: "KA-01-AB-1234",
                    },
                    type: {
                      type: "string",
                      description: "Vehicle type",
                      enum: ["car", "bike", "scooter"],
                      example: "car",
                    },
                    roomNo: {
                      type: "string",
                      description: "Room number",
                      example: "101",
                    },
                    bldgName: {
                      type: "string",
                      description: "Building name",
                      example: "Building A",
                    },
                    contact: {
                      type: "string",
                      description: "Mobile Number",
                      example: 9123456780,
                    },
                    file: {
                      type: "string",
                      format: "binary",
                      description:
                        "Sticker image file (optional, JPEG, PNG, etc.)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Vehicle updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/VehicleResponse",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - No token provided",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UnauthorizedError",
                  },
                },
              },
            },
            404: {
              description: "Vehicle not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/NotFoundError",
                  },
                },
              },
            },
            400: {
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/vehicles/delete/{id}": {
        post: {
          tags: ["Vehicles"],
          summary: "Delete vehicle",
          description: "Delete a vehicle by ID",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Vehicle ID (MongoDB ObjectId)",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Vehicle deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "Vehicle deleted successfully",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - No token provided",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UnauthorizedError",
                  },
                },
              },
            },
            404: {
              description: "Vehicle not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/NotFoundError",
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
