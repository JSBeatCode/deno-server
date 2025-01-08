import { 
        handleData, 
        handleHello, 
        handleRoot, 
        getProducts, 
        getProduct, 
        addProduct,
        updateProduct,
        deleteProduct
    } from './controller/products.ts'


const staticRoutes: Record<string, (req: Request) => Promise<Response> | Response> = {
    "GET /": () => handleRoot(),
    "GET /hello": () => handleHello(),
    "POST /data": (req) => handleData(req),
    "GET /all": () => getProducts(),
    "POST /products": (req) => addProduct(req)
}
// Explanation of the Record type:
// 1. Record<string, T>
// Record<K, T> is a TypeScript utility type that allows you to define the types of an object’s keys and values explicitly.
// Here:
// string: Specifies that the object keys must be of type string.
// (req: Request) => Promise<Response> | Response: Specifies that the object values must be functions of this specific type.
// 2. string (Key Type)
// The keys of the routes object are strings, combining the HTTP method and the route path.
// Example: "GET /" or "POST /data".
// 3. (req: Request) => Promise<Response> | Response (Value Type)
// The value type is a function that takes a Request object as a parameter and returns either a Response or a Promise<Response>.
// This function acts as a handler for processing HTTP requests.

// Explanation of the handler function type:
// 1. req: Request
// Takes a parameter of type Request.
// Represents an HTTP request object, containing information such as the URL, headers, and body.
// 2. Promise<Response>
// If the function operates asynchronously, it returns a Promise wrapping a Response object.
// Example: Handling JSON data, database operations, etc.
// 3. Response
// If the function operates synchronously, it directly returns a Response object.
// Example: Simple text responses, HTML rendering, etc.

const dyanmicRoutes = [
    {
        name: 'getProduct',
        url: /^\/product\/([\w-]+)$/,
        method: "GET",
        func: getProduct
    },
    {
        name: 'updateProduct',
        url: /^\/product\/([\w-]+)$/,
        method: "PUT",
        func: updateProduct
    },
    {
        name: 'deleteProduct',
        url: /^\/product\/([\w-]+)$/,
        method: "DELETE",
        func: deleteProduct
    }
]

export { staticRoutes, dyanmicRoutes }

  