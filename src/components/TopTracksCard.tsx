import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Track } from '@/types'
import Card from './Shared/Card'
import FakeChart from './FakeChart'

interface TopTracksCardProps {
  tracks: Track[]
}

export default function TopTracksCard({ tracks }: TopTracksCardProps) {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [audioError, setAudioError] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = (rank: number, preview: string) => {
    if (playingTrack === rank) {
      audioRef.current?.pause()
      setPlayingTrack(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(preview)
    audio.volume = 0.5
    audioRef.current = audio

    audio.play().then(() => {
      setPlayingTrack(rank)
      setAudioError(null)
    }).catch(() => {
      setAudioError(rank)
      setPlayingTrack(null)
    })

    audio.onended = () => setPlayingTrack(null)
  }

  const maxPlays = Math.max(...tracks.map(t => t.plays))

  return (
    <Card>
      <div className="p-6 md:p-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-poppins text-2xl md:text-3xl font-bold text-deep-cocoa mb-2"
        >
          Top Músicas
        </motion.h2>
        <p className="text-deep-cocoa/60 mb-8">As trilhas sonoras dos nossos momentos</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <FakeChart tracks={tracks} />
          </div>

          <div className="order-1 md:order-2 space-y-3">
            {tracks.map((track, index) => (
              <motion.div
                key={track.rank}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors group"
              >
                <span className="font-poppins font-bold text-2xl text-warm-terracotta w-8">
                  {track.rank}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-deep-cocoa truncate">{track.title}</h3>
                  <p className="text-sm text-deep-cocoa/60 truncate">{track.artist}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block">
                    <div className="h-2 w-20 bg-deep-cocoa/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(track.plays / maxPlays) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-warm-terracotta to-muted-teal"
                      />
                    </div>
                    <p className="text-xs text-deep-cocoa/50 mt-1">{track.plays} plays</p>
                  </div>

                  <button
                    onClick={() => handlePlay(track.rank, track.preview)}
                    className={`p-2 rounded-full transition-colors ${
                      playingTrack === track.rank 
                        ? 'bg-warm-terracotta text-white' 
                        : 'bg-deep-cocoa/10 text-deep-cocoa hover:bg-warm-terracotta/20'
                    }`}
                    aria-label={playingTrack === track.rank ? `Pausar ${track.title}` : `Tocar ${track.title}`}
                  >
                    {playingTrack === track.rank ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}

            {audioError && (
              <p className="text-sm text-warm-terracotta text-center mt-4">
                Preview indisponível. Adicione o arquivo de áudio.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
