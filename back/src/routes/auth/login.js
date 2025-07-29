export async function signin(request, reply) {
    return (reply.code(200).send({ message: "You are now logged" }));
}
