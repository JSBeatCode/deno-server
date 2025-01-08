import { Client } from "postgres"; // Import the PostgreSQL client for database operations.
import { dbCreds } from "@/config";
// import { Products } from "../types/productsType.ts";
import { Products } from "@/types/products";
const client = new Client(dbCreds); 
// Initialize a new PostgreSQL client with the provided credentials.

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8", 
  // Define common headers for JSON responses.
};

const JSONFY = (rows: any) => {
  return JSON.stringify(rows, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  ); 
  // Convert database rows into a JSON string, converting `bigint` types to strings for compatibility.
};

const QRY_PARAMS_TO_STRING = (params: any) => {
  return "'" + params + "'"; 
  // Wrap query parameters in single quotes to safely include them in SQL strings.
};

const getProducts = async (): Promise<Response> => {
  // Fetch all products from the database.
  const result: any = new Object();
  try {
    await client.connect(); // Connect to the database.
    const queryResult = await client.queryObject("SELECT * FROM products"); 
    // Execute a query to retrieve all products.
    await client.end(); // Close the database connection.

    // Check if any data was returned. If not, throw an error.
    if (
      queryResult.rows === null ||
      queryResult.rows === undefined ||
      !Array.isArray(queryResult.rows) ||
      queryResult.rows.length === 0
    ) {
      throw new Error("there is no data");
    }

    result.data = JSONFY(queryResult.rows); // Convert rows to JSON.
    result.status = 200; // Success status.
  } catch (e: any) {
    console.error(e); // Log any errors.
    result.data = JSON.stringify({ Exception: String(e) }); // Return error details in JSON format.
    result.status = 500; // Internal server error status.
  }
  return new Response(result.data, { status: result.status, headers: HEADERS });
};

const getProduct = async (params: any): Promise<Response> => {
  // Fetch a single product based on its ID.
  const result: any = new Object();
  try {
    await client.connect(); // Connect to the database.
    const id = params.url[1]; // Extract the product ID from URL parameters.
    const queryResult = await client.queryObject(
      `SELECT * FROM products WHERE id = ${id}`
    ); 
    // Query the database for the specified product ID.
    await client.end(); // Close the connection.

    if (
      queryResult.rows === null ||
      queryResult.rows === undefined ||
      !Array.isArray(queryResult.rows) ||
      queryResult.rows.length === 0
    ) {
      throw new Error("there is no data");
    }

    result.data = JSONFY(queryResult.rows); // Convert rows to JSON.
    result.status = 200; // Success status.
  } catch (e) {
    console.error(e); // Log any errors.
    result.data = JSON.stringify({ Exception: String(e) }); // Return error details.
    result.status = 500; // Internal server error status.
  }
  return new Response(result.data, { status: result.status, headers: HEADERS });
};

const addProduct = async (req: any): Promise<Response> => {
  // Add a new product to the database.
  const result: any = new Object();
  try {
    const product: Products = await req.json(); 
    // Parse the request body as a `Product` object.

    if (
      product !== null &&
      product !== undefined &&
      typeof product === "object" &&
      Object.keys(product).length > 0
    ) {
      // Ensure the product object is valid and not empty.
      const name = QRY_PARAMS_TO_STRING(product.name); // Wrap the name in quotes.
      const description = QRY_PARAMS_TO_STRING(product.description); // Wrap the description in quotes.
      const price = product.price; // Extract the price.

      await client.connect(); // Connect to the database.
      const queryResult = await client.queryObject(`
        INSERT INTO products
        (name, description, price) 
        VALUES (${name}, ${description}, ${price})
      `); 
      // Insert the product into the database.
      await client.end(); // Close the connection.

      result.status = 200; // Success status.
      result.data = { success: queryResult.rowCount }; // Include the number of rows affected.
    } else {
      result.status = 400; // Bad request status.
      result.data = { msg: "No Data" }; // Error message for invalid input.
    }
  } catch (e) {
    console.error(e); // Log any errors.
    result.status = 500; // Internal server error status.
    result.data = { Error: String(e) }; // Include error details in the response.
  }
  return new Response(JSON.stringify(result.data), {
    status: result.status,
    headers: HEADERS,
  });
};

// Other methods (`updateProduct`, `deleteProduct`, etc.) follow similar patterns with logic adjusted for specific operations.


// Function to update a product in the database
const updateProduct = async (params: any): Promise<Response> => {
  const result: any = new Object(); // Initialize an object to store the response data
  result.data = {}; // Default data object
  result.status = 200; // Default status code

  try {
    // Fetch the product by its ID
    const res = await getProduct(params);
    const product = await res.json(); // Extract product data from the response
    const request = await params.req.json(); // Parse JSON data from the request body

    // Check if the product exists and is a valid object
    if (product !== null && product !== undefined && typeof product === 'object' && Object.keys(product).length > 0) {
      // Convert fields to strings using a utility function
      const name = QRY_PARAMS_TO_STRING(request.name);
      const description = QRY_PARAMS_TO_STRING(request.description);
      const price = request.price;

      await client.connect(); // Connect to the database
      const qryRst = await client.queryObject(`
        UPDATE products 
        SET name = ${name}
        , description = ${description}
        , price = ${price} 
        WHERE id = ${params.url[1]}
      `); // SQL query to update the product by its ID

      result.status = 200; // Set the response status code to success
      result.data = { success: qryRst.rowCount }; // Return the number of updated rows
    } else {
      result.status = 400; // Set status to 400 if no data is found
      result.data = { msg: 'No Data' }; // Response message for no data
    }
  } catch (e) {
    console.error(e); // Log any errors
    result.data = { Error: String(e) }; // Include the error in the response
    result.status = 500; // Set status to 500 for server error
  } finally {
    await client.end(); // Ensure the database connection is closed
  }
  return new Response(JSON.stringify(result.data), { status: result.status, headers: HEADERS });
};

// Function to delete a product from the database
const deleteProduct = async (params: any): Promise<Response> => {
  const result: any = new Object(); // Initialize an object to store the response data
  result.data = {}; // Default data object
  result.status = 200; // Default status code

  try {
    // Fetch the product by its ID
    const res = await getProduct(params);
    const product = await res.json(); // Extract product data from the response

    // Check if the product exists and is a valid object
    if (product !== null && product !== undefined && typeof product === 'object' && Object.keys(product).length > 0) {
      const id = params.url[1]; // Extract the product ID from the URL
      await client.connect(); // Connect to the database
      const qryRst = await client.queryObject(`
        DELETE FROM products 
        WHERE id = ${id}
      `); // SQL query to delete the product by its ID

      result.status = 200; // Set the response status code to success
      result.data = { success: qryRst.rowCount }; // Return the number of deleted rows
    } else {
      result.status = 400; // Set status to 400 if no data is found
      result.data = { msg: 'No Data' }; // Response message for no data
    }
  } catch (e) {
    console.error(e); // Log any errors
    result.data = { Error: String(e) }; // Include the error in the response
    result.status = 500; // Set status to 500 for server error
  } finally {
    await client.end(); // Ensure the database connection is closed
  }
  return new Response(JSON.stringify(result.data), { status: result.status, headers: HEADERS });
};

// Function to handle the root route and return a simple message
const handleRoot = (): Response => {
  return new Response("hi it's deno api server", {
    status: 200,
    // headers: HEADERS
  });
};

// Function to handle the "/hello" route and return a JSON message
const handleHello = (): Response => {
  return new Response(JSON.stringify({ message: "Hi World!" }), {
    status: 200,
    headers: HEADERS,
  });
};

// Function to handle a POST request with JSON data
const handleData = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json(); // Parse JSON from the request body
    return new Response(
      JSON.stringify({ received: body, message: "Data Received" }),
      {
        status: 200, // Return success status
        headers: HEADERS,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "it's invalid json data" }),
      {
        status: 400, // Return a 400 status for invalid JSON
        headers: HEADERS,
      }
    );
  }
};

export {
  handleData, // Handler for generic data processing.
  handleHello, // Handler for a simple greeting endpoint.
  handleRoot, // Handler for the root endpoint.
  getProducts, // Handler for retrieving all products.
  getProduct, // Handler for retrieving a single product.
  addProduct, // Handler for adding a new product.
  updateProduct, // Handler for updating an existing product.
  deleteProduct, // Handler for deleting a product.
};
