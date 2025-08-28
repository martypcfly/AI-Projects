import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    if (!request.body) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 })
    }

    const arrayBuffer = await request.arrayBuffer()

    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json({ error: "Empty file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob with proper content-length and addRandomSuffix to prevent duplicate filename errors
    const blob = await put(filename, arrayBuffer, {
      access: "public",
      contentType: request.headers.get("content-type") || "application/octet-stream",
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
