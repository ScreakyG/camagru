export async function publishImage(request, reply) {
    let uploadedFile = null;
    let overlay = null;

    try
    {
        const parts = request.parts();
        for await (const part of parts)
        {
            if (part.type === "file")
            {
                uploadedFile = await part.toBuffer();
            }
            else if (part.type === "field")
            {
                overlay = part;
            }
        }

        console.log("Uploaded file = ", uploadedFile);
        console.log("Selected overlay = ", overlay, overlay.value);
        return (reply.send({success: true, message: "Endpoint success call"}));
    }
    catch(error)
    {
        console.log("CATCHED ERROR = ", error);
        return (reply.send({success: false, message: "Error with uploaded file/selected overlay."}))
    }
}
