export async function userInfos(request, reply) {
    return (reply.send({ success: true, user: request.user }));
}
