import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, CheckCircle, Loader2 } from 'lucide-react'
import { BASE_URL, API_URL } from '../services/api'

const SIGNALING_SERVER_URL = BASE_URL

const rtcConfig = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
}

interface LocationState {
    initialMuted?: boolean;
    initialVideoOff?: boolean;
}

export function MeetingRoom() {
    const { meetingId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as LocationState | null

    // State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
    const [isMuted, setIsMuted] = useState(locationState?.initialMuted || false)
    const [isVideoOff, setIsVideoOff] = useState(locationState?.initialVideoOff || false)
    const [transcript, setTranscript] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingMessage, setProcessingMessage] = useState('')
    const [hasEnded, setHasEnded] = useState(false)

    // Refs
    const localStreamRef = useRef<MediaStream | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const userId = useRef(Math.random().toString(36).substring(7))
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        initializeMeeting()
        return () => cleanupMeeting()
    }, [meetingId])

    const initializeMeeting = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
            setLocalStream(stream)
            localStreamRef.current = stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            socketRef.current = io(SIGNALING_SERVER_URL)

            socketRef.current.emit('join-room', meetingId, userId.current)

            socketRef.current.on('all-users', (users: string[]) => {
                console.log('Existing users in room:', users)
                users.forEach(id => {
                    const pc = createPeerConnection(id)
                    pc.createOffer().then(offer => {
                        pc.setLocalDescription(offer)
                        socketRef.current?.emit('offer', { target: id, offer: offer })
                    })
                })
            })

            socketRef.current.on('user-connected', (payload: { userId: string, socketId: string }) => {
                console.log(`User ${payload.userId} connected with socket ${payload.socketId} `)
            })

            socketRef.current.on('offer', async (payload: { offer: RTCSessionDescriptionInit, caller: string }) => {
                console.log('Received offer from', payload.caller)
                const pc = createPeerConnection(payload.caller)
                await pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                socketRef.current?.emit('answer', { target: payload.caller, answer: answer })
            })

            socketRef.current.on('answer', async (payload: { answer: RTCSessionDescriptionInit, caller: string }) => {
                console.log('Received answer from', payload.caller)
                const pc = peerConnections.current.get(payload.caller)
                if (pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(payload.answer))
                }
            })

            socketRef.current.on('ice-candidate', async (payload: { candidate: RTCIceCandidateInit, caller: string }) => {
                console.log('Received ICE candidate from', payload.caller)
                const pc = peerConnections.current.get(payload.caller)
                if (pc && payload.candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
                }
            })

            socketRef.current.on('user-disconnected', (socketId: string) => {
                handleUserDisconnected(socketId)
            })

            console.log(`Joined room ${meetingId} as ${userId.current} `)

            // Sync meeting status to 'live' on join
            try {
                await fetch(`${API_URL}/meetings/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ meetingId }),
                });
            } catch (err) {
                console.error('Failed to sync meeting status to live:', err);
            }

            if (stream.getAudioTracks().length > 0) {
                startRecording(stream)
            }

            // @ts-ignore
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                startTranscription()
            }

        } catch (err) {
            console.error('Failed to access media devices:', err)
            alert('Could not access camera/microphone. Please check permissions.')
        }
    }

    const startRecording = (stream: MediaStream) => {
        try {
            const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
            const supportedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

            if (!supportedType) return;

            const audioStream = new MediaStream(stream.getAudioTracks());
            const mediaRecorder = new MediaRecorder(audioStream, { mimeType: supportedType });
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                    // We still stream to backend for real-time processing if needed
                    if (socketRef.current) {
                        socketRef.current.emit('audio-chunk', {
                            roomId: meetingId,
                            chunk: event.data
                        })
                    }
                }
            }

            mediaRecorder.start(1000)
        } catch (e) {
            console.error('MediaRecorder error:', e)
        }
    }

    const uploadAudio = async () => {
        if (audioChunksRef.current.length === 0) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.requestData();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', audioBlob, `${meetingId}.webm`)

        try {
            await fetch(`${API_URL}/meetings/${meetingId}/audio`, {
                method: 'POST',
                body: formData,
            })
        } catch (error: any) {
            console.error('Error uploading audio:', error)
        }
    }

    const startTranscription = () => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
            let currentTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                currentTranscript += event.results[i][0].transcript
            }
            setTranscript(currentTranscript)
        }

        recognitionRef.current = recognition
        recognition.start()
    }

    const createPeerConnection = (socketId: string) => {
        const pc = new RTCPeerConnection(rtcConfig)

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', {
                    target: socketId,
                    candidate: event.candidate,
                })
            }
        }

        pc.ontrack = (event) => {
            setRemoteStreams(prev => {
                const next = new Map(prev)
                next.set(socketId, event.streams[0])
                return next
            })
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!)
            })
        }

        peerConnections.current.set(socketId, pc)
        return pc
    }

    const handleUserDisconnected = (socketId: string) => {
        const pc = peerConnections.current.get(socketId)
        if (pc) {
            pc.close()
            peerConnections.current.delete(socketId)
        }
        setRemoteStreams(prev => {
            const next = new Map(prev)
            next.delete(socketId)
            return next
        })
    }

    const forceStopResources = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        setLocalStream(null);
        peerConnections.current.forEach(pc => pc.close());
        peerConnections.current.clear();
        setRemoteStreams(new Map());

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
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

    const leaveMeeting = async () => {
        setIsProcessing(true);
        setProcessingMessage('Wrapping up...');
        forceStopResources();
        try {
            await fetch(`${API_URL}/meetings/${meetingId}/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error('Failed to end meeting:', err);
        }
        await uploadAudio();
        setIsProcessing(false);
        setHasEnded(true);
    }

    const cleanupMeeting = () => {
        forceStopResources();
    }

    const meetingTitle = `Meeting ${meetingId || ''}`

    if (hasEnded) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6 font-inter">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Meeting Ended</h1>
                <p className="text-slate-500 text-lg mb-10 max-w-md font-medium">Your AI summary is being generated. You can access it from the dashboard shortly.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-base font-bold transition-all"
                    >
                        Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-[#202124] text-white font-sans overflow-hidden">
            {/* Overlays */}
            {isProcessing && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold mb-2 text-white">Processing Meeting</h2>
                    <p className="text-slate-400 text-base font-medium">{processingMessage}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 bg-[#202124] relative z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium text-white">{meetingTitle}</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3c4043] rounded-full text-xs font-medium text-white">
                        <Users size={14} className="text-slate-300" />
                        <span>{remoteStreams.size + 1}</span>
                    </div>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr overflow-y-auto">
                {/* Local Video */}
                <div className="relative rounded-2xl overflow-hidden bg-[#3c4043] aspect-video ring-1 ring-black/10">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-[#5f6368] flex items-center justify-center mb-4 text-white font-bold text-xl">
                                You
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                        <span className="text-sm font-medium text-white drop-shadow-md">You</span>
                    </div>
                </div>

                {/* Remote Videos */}
                {Array.from(remoteStreams.entries()).map(([streamUserId, stream]) => (
                    <div key={streamUserId} className="relative rounded-2xl overflow-hidden bg-[#3c4043] aspect-video ring-1 ring-black/10">
                        <RemoteVideo stream={stream} />
                        <div className="absolute bottom-4 left-4">
                            <span className="text-sm font-medium text-white drop-shadow-md">
                                Participant
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="h-20 bg-[#202124] flex items-center justify-center gap-4 px-6 mb-4">
                <button
                    onClick={toggleMute}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-[#ea4335] text-white hover:bg-[#d93025]' : 'bg-[#3c4043] text-white hover:bg-[#434649]'}`}
                >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                    onClick={toggleVideo}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-[#ea4335] text-white hover:bg-[#d93025]' : 'bg-[#3c4043] text-white hover:bg-[#434649]'}`}
                >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                <div className="w-px h-8 bg-white/20 mx-2" />

                <button
                    onClick={leaveMeeting}
                    className="h-12 px-6 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white flex items-center gap-2 transition-all font-medium text-sm"
                >
                    <PhoneOff size={20} />
                    <span>Leave call</span>
                </button>
            </div>

            {/* Subtitles Overlay */}
            {transcript && (
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg text-white text-lg font-medium text-center pointer-events-none max-w-3xl">
                    {transcript}
                </div>
            )}
        </div>
    )
}

function RemoteVideo({ stream }: { stream: MediaStream }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
        />
    )
}
