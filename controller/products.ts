import { Client } from "postgres";
// import { dbCreds } from "../config/index.ts";
import { dbCreds } from "@/config";
// import { Products } from "../types/productsType.ts";
import { Products } from "@/types/products";

const client = new Client(dbCreds)

const HEADERS = {
    "Content-Type": "application/json; charset=utf-8"
}

const JSONFY = (rows: any) => {
    return JSON.stringify(rows, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
    )
}

const QRY_PARAMS_TO_STRING = (params: any) => {
  return "'" + params + "'";
}

const getProducts = async (): Promise<Response> => {
    const result: any = new Object();
    try { 
        await client.connect()
        const queryResult = await client.queryObject("SELECT * FROM products")
        await client.end()
        
        if (queryResult.rows === null || queryResult.rows === undefined || !Array.isArray(queryResult.rows) || queryResult.rows.length === 0) {
            throw new Error('there is no data')
        }

        result.data = JSONFY(queryResult.rows)
        result.status = 200
    } catch(e: any) {
        console.error(e)
        result.data = JSON.stringify({ Exception: String(e) })
        result.status = 500        
    }
    return new Response(result.data, {status: result.status, headers: HEADERS})
}

const getProduct = async (params: any): Promise<Response> => {
    const result: any = new Object();
    try {
        await client.connect()
        const id = params.url[1]
        const queryResult = await client.queryObject(`SELECT * FROM products WHERE id = ${id}`) 
        await client.end()

        if (queryResult.rows === null || queryResult.rows === undefined || !Array.isArray(queryResult.rows) || queryResult.rows.length === 0) {
            throw new Error('there is no data')
        }

        result.data = JSONFY(queryResult.rows)
        result.status = 200
    } catch (e) {
        console.error(e)
        result.data = JSON.stringify({ Exception: String(e) })
        result.status = 500
    }
    return new Response(result.data, {status: result.status, headers: HEADERS})    

}

const addProduct = async (req: any): Promise<Response> => {
    const result: any = new Object();
    try {
        const product: Products = await req.json()
        // const product = body.value
        
        if (product !== null && product !== undefined && typeof product === 'object' && Object.keys(product).length > 0) {
            const name = QRY_PARAMS_TO_STRING(product.name)
            const description = QRY_PARAMS_TO_STRING(product.description)
            const price = product.price

            await client.connect()
            const queryResult = await client.queryObject(`
              INSERT INTO products
              (
                name, 
                description, 
                price
              ) 
                VALUES (
                ${name}, 
                ${description}, 
                ${price}
              )
              `);
              // console.log('debug5 queryResult', queryResult.rowCount)
            await client.end()
            result.status = 200
            result.data = { success: queryResult.rowCount }
            // return new Response(JSON.stringify(product), {status: 200, headers: HEADERS})
        } else {
            result.status = 400
            result.data = {
                msg: 'No Data'
            }
            // return new Response(JSON.stringify(result), {status: 200, headers: HEADERS})
            
        }
    } catch (e) {
        console.error(e)
        result.status = 500
        result.data = { Error: String(e) }
    }
    return new Response(JSON.stringify(result.data), {status: result.status, headers: HEADERS})
}

const updateProduct = async (params: any): Promise<Response> => {
  const result: any = new Object();
  result.data = {}
  result.status = 200

  try {
    const res = await getProduct(params);
    const product = await res.json() 
    const request = await params.req.json()
    if (product !== null && product !== undefined && typeof product === 'object' && Object.keys(product).length > 0) {
      const name = QRY_PARAMS_TO_STRING(request.name)
      const description = QRY_PARAMS_TO_STRING(request.description)
      const price = request.price
      
      await client.connect()
      const  qryRst =  await client.queryObject(`
        UPDATE products 
        SET name = ${name}
        , description = ${description}
        , price = ${price} 
        WHERE id = ${params.url[1]}
        `);

        result.status = 200
        result.data = {
            success: qryRst.rowCount
        }  
    } else {
      result.status = 400
      result.data = {
          msg: 'No Data'
      }
    }
  } catch (e) {
    console.error(e)
    result.data = { Error: String(e) }
    result.status = 500
  } finally {
    await client.end()
  }
  return new Response(JSON.stringify(result.data), {status: result.status, headers: HEADERS})
}

const deleteProduct = async (params: any): Promise<Response> => {
  const result: any = new Object();
  result.data = {}
  result.status = 200

  try {
    const res = await getProduct(params);
    const product = await res.json() 
    if (product !== null && product !== undefined && typeof product === 'object' && Object.keys(product).length > 0) {
      const id = params.url[1]
      await client.connect()
      const  qryRst =  await client.queryObject(`
        DELETE FROM products 
        WHERE id = ${id}
      `);

      result.status = 200
      result.data = {
          success: qryRst.rowCount
      }
    } else {
      result.status = 400
      result.data = {
          msg: 'No Data'
      }
    }
  } catch (e) {
    console.error(e)
    result.data = { Error: String(e) }
    result.status = 500
  } finally {
    await client.end()
  }
  return new Response(JSON.stringify(result.data), {status: result.status, headers: HEADERS})
}

const handleRoot = (): Response => {
    return new Response("hi it's deno api server", {
        status: 200,
        // headers: HEADERS
      })
}

const handleHello = (): Response => {
  return new Response(JSON.stringify({ message: " Hi World!" }), {
    status: 200,
    headers: HEADERS
  })
}

const handleData = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    return new Response(
      JSON.stringify({ received: body, message: "Data Received" }),
      {
        status: 200,
        headers: HEADERS,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "it's invalid json data" }),
      {
        status: 400,
        headers: HEADERS
      }
    );
  }
}

export { 
    handleData, 
    handleHello, 
    handleRoot, 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}