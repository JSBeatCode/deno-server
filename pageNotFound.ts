export const handleNotFound = (): Response => {
    return new Response("Page Not Founded", {
        status: 404,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    })
}
