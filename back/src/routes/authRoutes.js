async function authRoutes(fastify, options) {
    fastify.post("/register", async (request, reply) => {
        const bodyData = request.body;

        console.log("Request body = ", bodyData);
        return (reply.code(200).send({ message:"Succesfully called API", content: bodyData }));
    })
}

export default authRoutes;
