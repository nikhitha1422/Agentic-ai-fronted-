import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Loader2, XCircle, ArrowLeft } from 'lucide-react'
import { BASE_URL } from '../services/api'

const SIGNALING_SERVER_URL = BASE_URL

interface LocationState {
    initialMuted?: boolean
    initialVideoOff?: boolean
    userName?: string
}

export function WaitingRoom() {
    const { meetingId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as LocationState | null

    const [status, setStatus] = useState<'waiting' | 'approved' | 'rejected'>('waiting')
    const [message, setMessage] = useState('Waiting for host approval...')
    const socketRef = useRef<Socket | null>(null)

    const userName = locationState?.userName || `Guest-${Math.random().toString(36).substring(2, 7)}`

    useEffect(() => {
        // Connect to socket
        socketRef.current = io(SIGNALING_SERVER_URL)

        // Send join request
        socketRef.current.emit('join-request', {
            roomId: meetingId,
            userName: userName
        })

        // Listen for approval
        socketRef.current.on('user-approved', ({ roomId }) => {
            console.log('[Waiting Room] Approved to join:', roomId)
            setStatus('approved')
            setMessage('Access granted! Joining meeting...')

            // Navigate to meeting room with initial settings
            setTimeout(() => {
                navigate(`/meeting/live/${meetingId}`, {
                    state: {
                        initialMuted: locationState?.initialMuted || false,
                        initialVideoOff: locationState?.initialVideoOff || false
                    }
                })
            }, 1000)
        })

        // Listen for rejection
        socketRef.current.on('user-rejected', ({ message: rejectMessage }) => {
            console.log('[Waiting Room] Rejected:', rejectMessage)
            setStatus('rejected')
            setMessage(rejectMessage || 'Host denied entry')
        })

        // Listen for acknowledgment
        socketRef.current.on('join-request-received', ({ message: ackMessage }) => {
            setMessage(ackMessage)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [meetingId, navigate, locationState])

    const goBack = () => {
        navigate(`/meet/${meetingId}`)
    }

    const goHome = () => {
        navigate('/')
    }

    // Rejected state
    if (status === 'rejected') {
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Entry Denied</h1>
                    <p className="text-white/60 text-lg mb-8">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={goBack}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Try Again
                        </button>
                        <button
                            onClick={goHome}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Approved state (brief transition)
    if (status === 'approved') {
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Access Granted!</h1>
                    <p className="text-white/60 text-lg">Joining meeting...</p>
                </div>
            </div>
        )
    }

    // Waiting state (default)
    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Animated waiting indicator */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">Waiting Room</h1>
                <p className="text-white/60 text-lg mb-2">{message}</p>
                <p className="text-white/40 text-sm mb-8">
                    Please wait while the host lets you in.
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <p className="text-white/50 text-sm">Joining as</p>
                    <p className="text-white font-medium">{userName}</p>
                </div>

                <button
                    onClick={goBack}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft size={14} />
                    Leave waiting room
                </button>
            </div>
        </div>
    )
}
