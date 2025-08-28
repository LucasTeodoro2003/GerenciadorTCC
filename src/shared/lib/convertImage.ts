export async function fileToBase64(file: File): Promise<string>{
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "application/octet-stream"
    const base64 = buffer.toString('base64')
    const dataUri = `data:${mimeType};base64,${base64}`;
    return dataUri;
}