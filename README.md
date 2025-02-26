# Dummy JSON Custom API

This is a simple Express.js API for managing products. The API allows you to filter, sort, paginate, and search products, as well as retrieve categories.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/dummyjson-custorm.git
   ```

2. Navigate to the project directory:

   ```sh
   cd dummyjson-custorm
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

### Running the Server

Start the server:

```sh
node index.js
```

The server will run on [http://localhost:3000](http://localhost:3000).

## Endpoints

### Get Products

**URL**

```
GET /products
```

**Query Parameters**

- `category` (string): Filter products by category.
- `minPrice` (number): Minimum price of products.
- `maxPrice` (number): Maximum price of products.
- `limit` (number): Number of products to return.
- `skip` (number): Number of products to skip.
- `sortBy` (string): Field to sort by.
- `order` (string): Sort order (`asc` or `desc`).
- `select` (string): Comma-separated list of fields to return.

### Get Categories

**URL**

```
GET /categories
```

### Search Products

**URL**

```
GET /products/search
```

**Query Parameters**

- `q` (string): Search query.

## CORS Configuration

The server is configured to allow requests from [https://ecommerce-infotechtion-qkeb.vercel.app](https://ecommerce-infotechtion-qkeb.vercel.app).

## License

This project is licensed under the MIT License.
