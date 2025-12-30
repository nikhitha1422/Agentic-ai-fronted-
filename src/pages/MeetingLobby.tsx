import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, Loader2 } from 'lucide-react'
import { API_URL } from '../services/api'

export function MeetingLobby() {
    const { meetingId } = useParams()
    const navigate = useNavigate()

    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [meetingTitle, setMeetingTitle] = useState('Meeting')
    const [error, setError] = useState('')

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        initializePreview()
        fetchMeetingDetails()

        return () => {
            // Cleanup on unmount (if user navigates away without joining)
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [meetingId])

    const fetchMeetingDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/meetings/${meetingId}`)
            if (res.ok) {
                const data = await res.json()
                setMeetingTitle(data.title || 'Meeting')
            }
        } catch (err) {
            console.error('Failed to fetch meeting details:', err)
        }
    }

    const initializePreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
            setLocalStream(stream)
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setIsLoading(false)
        } catch (err) {
            console.error('Failed to access media devices:', err)
            setError('Could not access camera/microphone. Please check permissions.')
            setIsLoading(false)
        }
    }

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled
            })
            setIsMuted(!isMuted)
        }
    }

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled
            })
            setIsVideoOff(!isVideoOff)
        }
    }

    const joinMeeting = () => {
        // Stop preview stream - MeetingRoom will get its own stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }
        // Navigate to waiting room with state for initial settings
        navigate(`/meeting/waiting/${meetingId}`, {
            state: {
                initialMuted: isMuted,
                initialVideoOff: isVideoOff,
                userName: `Guest-${Math.random().toString(36).substring(2, 7)}`
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white/70 font-medium">Setting up your camera...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <VideoOff size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Camera Access Required</h2>
                    <p className="text-white/60 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">

                {/* Camera Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-[#3c4043] aspect-video shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#3c4043]">
                            <div className="w-24 h-24 rounded-full bg-[#5f6368] flex items-center justify-center text-white font-bold text-2xl">
                                You
                            </div>
                        </div>
                    )}

                    {/* Preview Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                        <button
                            onClick={toggleMute}
                            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isMuted
                                ? 'bg-[#ea4335] text-white hover:bg-[#d93025]'
                                : 'bg-[#3c4043]/80 backdrop-blur text-white hover:bg-[#434649]'
                                }`}
                        >
                            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isVideoOff
                                ? 'bg-[#ea4335] text-white hover:bg-[#d93025]'
                                : 'bg-[#3c4043]/80 backdrop-blur text-white hover:bg-[#434649]'
                                }`}
                        >
                            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                        </button>
                    </div>
                </div>

                {/* Join Panel */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Ready to join?
                    </h1>
                    <p className="text-white/60 text-lg mb-2">
                        {meetingTitle}
                    </p>
                    <p className="text-white/40 text-sm mb-8">
                        Meeting ID: <span className="font-mono">{meetingId}</span>
                    </p>

                    <button
                        onClick={joinMeeting}
                        className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Join now
                    </button>

                    <p className="text-white/40 text-xs mt-6">
                        Your mic and camera are {isMuted ? 'off' : 'on'} and {isVideoOff ? 'off' : 'on'}
                    </p>
                </div>
            </div>
        </div>
    )
}
