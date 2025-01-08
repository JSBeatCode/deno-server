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

// Record 타입 설명:
// 1. Record<string, T>
// Record<K, T>는 TypeScript의 유틸리티 타입으로, 객체의 키와 값의 타입을 명확히 지정할 수 있습니다.
// 여기서:
// string: 객체의 키 타입을 문자열로 지정.
// (req: Request) => Promise<Response> | Response: 객체의 값이 특정 함수 타입이어야 함을 지정.
// 2. string (키 타입)
// routes 객체의 키는 문자열로, 각 라우트의 경로와 HTTP 메서드를 결합한 형태입니다.
// 예: "GET /" 또는 "POST /data".
// 3. (req: Request) => Promise<Response> | Response (값 타입)
// 값 타입은 함수 형태로, Request 객체를 매개변수로 받아 Response 또는 Promise<Response>를 반환해야 합니다.
// 이 함수는 HTTP 요청을 처리하는 핸들러 역할을 합니다.

// 핸들러 함수 타입 설명:
// 1. req: Request
// Request 타입의 매개변수를 받습니다.
// HTTP 요청 객체로, URL, 헤더, 바디 등의 정보를 포함합니다.
// 2.Promise<Response>
// 함수가 비동기로 동작할 경우, Promise로 감싸진 Response 객체를 반환합니다.
// 예: JSON 데이터 처리, 데이터베이스 작업 등.
// 3. Response
// 함수가 동기적으로 동작할 경우, 바로 Response 객체를 반환합니다.
// 예: 간단한 텍스트 응답, HTML 렌더링 등.
const staticRoutes: Record<string, (req: Request) => Promise<Response> | Response> = {
    "GET /": () => handleRoot(),
    "GET /hello": () => handleHello(),
    "POST /data": (req) => handleData(req),
    "GET /all": () => getProducts(),
    "POST /products": (req) => addProduct(req)
}


const dyanmicRoutes = [
    {
        name: 'getProduct',
        // url: /^\/product\/(\d+)$/,
        url: /^\/product\/([\w-]+)$/,
        method: "GET",
        func: getProduct
    },
    {
        name: 'updateProduct',
        // url: /^\/product\/(\d+)$/,
        url: /^\/product\/([\w-]+)$/,
        method: "PUT",
        func: updateProduct
    },
    {
        name: 'deleteProduct',
        // url: /^\/product\/(\d+)$/,
        url: /^\/product\/([\w-]+)$/,
        method: "DELETE",
        func: deleteProduct
    }
]

export { staticRoutes, dyanmicRoutes }

  