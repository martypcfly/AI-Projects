"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Play, Pause, Trash2, Upload, Loader2 } from "lucide-react"

interface AudioRecorderProps {
  onAudioSaved: (audioUrl: string, duration: number) => void
  existingAudioUrl?: string
  existingDuration?: number
}

export default function AudioRecorder({ onAudioSaved, existingAudioUrl, existingDuration }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>(existingAudioUrl || "")
  const [duration, setDuration] = useState<number>(existingDuration || 0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setDuration(recordingTime)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Unable to access microphone. Please check your permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl("")
    setDuration(0)
    setRecordingTime(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const uploadAudio = async () => {
    if (!audioBlob) return

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      const filename = `audio-${Date.now()}.webm`
      formData.append("file", audioBlob, filename)

      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      const validDuration = isFinite(duration) && duration > 0 ? duration : recordingTime
      onAudioSaved(result.url, validDuration)
    } catch (err) {
      console.error("Error uploading audio:", err)
      setError("Failed to save audio. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00"
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="audio-controls">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--color-charcoal)]">Audio Recording</h3>

        {error && <div className="bg-red-100 border-2 border-red-200 text-red-800 p-3 rounded-lg text-sm">{error}</div>}

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--color-charcoal)] font-mono text-lg">{formatTime(recordingTime)}</span>
              </div>
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => {
                if (audioRef.current && !existingDuration) {
                  const audioDuration = audioRef.current.duration
                  if (isFinite(audioDuration) && audioDuration > 0) {
                    setDuration(Math.floor(audioDuration))
                  } else {
                    // Fallback to recording time if metadata duration is invalid
                    setDuration(recordingTime)
                  }
                }
              }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 border-2 border-[var(--color-border)] gap-3">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  size="sm"
                  className="rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-[var(--color-text)] font-medium text-black">
                  Audio Recording ({formatTime(duration > 0 ? duration : recordingTime)})
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                {audioBlob && !existingAudioUrl && (
                  <Button
                    onClick={uploadAudio}
                    disabled={isUploading}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Save Audio
                      </>
                    )}
                  </Button>
                )}

                <Button
                  onClick={deleteRecording}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 bg-transparent border-red-200 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-[var(--color-charcoal)] bg-white rounded-lg p-3 border border-[var(--color-border)] text-black">
          <p className="font-medium mb-1">Recording Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Speak clearly and at a comfortable pace</li>
            <li>• Find a quiet space for better audio quality</li>
            <li>• You can record multiple times until you're happy</li>
            <li>• Audio will be saved with your journal entry</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
