"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void
  existingImageUrl?: string
}

export default function ImageUploader({ onImageUploaded, existingImageUrl }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(existingImageUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()
      setImageUrl(url)
      onImageUploaded(url)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-4 border-2 border-[var(--color-border)]">
      <h4 className="text-lg font-medium text-[var(--color-text)] mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5" />
        Add a Photo
      </h4>

      <div className="space-y-4">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Uploaded memory"
              className="w-full h-48 object-cover rounded-lg border-2 border-[var(--color-border)]"
            />
            <Button
              onClick={handleRemoveImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text)] mb-2">Click to upload a photo</p>
            <p className="text-sm text-[var(--color-text-muted)]">Add a photo to help capture this memory</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        {!imageUrl && (
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            variant="outline"
            className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white bg-transparent"
          >
            {isUploading ? "Uploading..." : "Choose Photo"}
          </Button>
        )}

        {uploadError && (
          <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-200">
            {uploadError}
          </div>
        )}

        <div className="text-xs text-[var(--color-text-muted)] text-center">
          Supported formats: JPG, PNG, GIF • Max size: 5MB
        </div>
      </div>
    </Card>
  )
}
