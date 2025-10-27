export function publishImage(request, reply) {
    if (request.body)
        console.log(request.body);
    return (reply.send({success: true, message: "Endpoint success call"}));
}
