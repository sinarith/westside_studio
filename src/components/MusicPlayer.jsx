import { useEffect, useRef, useState } from "react";
import { Minus, Music2, Pause, Play, Plus, SkipBack, SkipForward } from "lucide-react";

const STORAGE_KEY = "noy-studio-music";
const getSavedPlayer = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
};
const savePlayer = (songIndex, volume, currentTime) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ songIndex, volume, currentTime })); }
  catch { /* Playback still works if browser storage is unavailable. */ }
};

const songs = [
  { title: "Hong Family", src: "/music/Hong Family.mp3" },
  { title: "Dai Chav", src: "/music/DaiChav.mp3" },
  { title: "After Hours", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const audio = useRef(null);
  const [songIndex, setSongIndex] = useState(() => Math.min(getSavedPlayer().songIndex || 0, songs.length - 1));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(() => getSavedPlayer().volume ?? 0.15);
  const [message, setMessage] = useState("");
  const savedTime = useRef(getSavedPlayer().currentTime || 0);
  const playerSettings = useRef({ songIndex, volume });
  playerSettings.current = { songIndex, volume };

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = volume;
    const restorePosition = () => {
      if (savedTime.current > 0 && Number.isFinite(player.duration)) {
        player.currentTime = Math.min(savedTime.current, Math.max(0, player.duration - 0.5));
      }
    };
    if (player.readyState >= 1) restorePosition();
    else player.addEventListener("loadedmetadata", restorePosition, { once: true });
    player.play()
      .then(() => setPlaying(true))
      .catch(() => setMessage("Press play to start the music."));
    return () => {
      player.removeEventListener("loadedmetadata", restorePosition);
      savePlayer(playerSettings.current.songIndex, playerSettings.current.volume, player.currentTime || savedTime.current);
    };
  }, []);

  useEffect(() => {
    const persist = () => savePlayer(playerSettings.current.songIndex, playerSettings.current.volume, audio.current?.currentTime || savedTime.current);
    window.addEventListener("beforeunload", persist);
    return () => {
      persist();
      window.removeEventListener("beforeunload", persist);
    };
  }, []);

  const persistProgress = () => {
    if (audio.current) savePlayer(playerSettings.current.songIndex, playerSettings.current.volume, audio.current.currentTime);
  };

  const togglePlayback = async () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      savePlayer(songIndex, volume, audio.current.currentTime);
      setPlaying(false);
      return;
    }
    try {
      audio.current.volume = volume;
      await audio.current.play();
      setPlaying(true);
      setMessage("");
    } catch {
      setPlaying(false);
      setMessage("Music could not load. Check your connection and try again.");
    }
  };

  const changeSong = (next) => {
    savedTime.current = 0;
    playerSettings.current = { songIndex: next, volume };
    savePlayer(next, volume, 0);
    setSongIndex(next);
    setMessage("");
    if (audio.current) {
      audio.current.pause();
      audio.current.src = songs[next].src;
      audio.current.load();
      audio.current.volume = volume;
      audio.current.play().then(() => { setPlaying(true); setMessage(""); }).catch(() => { setPlaying(false); setMessage("Press play to start this track."); });
    }
  };

  const changeVolume = (nextVolume) => {
    nextVolume = Math.min(1, Math.max(0, nextVolume));
    playerSettings.current = { songIndex, volume: nextVolume };
    setVolume(nextVolume);
    if (audio.current) audio.current.volume = nextVolume;
    savePlayer(songIndex, nextVolume, audio.current?.currentTime || savedTime.current);
  };

  return (
    <aside className="music-player glass-panel" aria-label="Background music player">
      <audio ref={audio} src={songs[songIndex].src} loop onTimeUpdate={persistProgress} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setMessage("Music could not load. Check your connection."); }} />
      <div className="music-topline"><span className="music-icon"><Music2 size={16} /></span><div><small>WESTSIDE RADIO</small><b>{songs[songIndex].title}</b></div><button className="music-toggle" type="button" onClick={togglePlayback} aria-label={playing ? "Pause music" : "Play music"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button></div>
      <div className="music-controls">
        <div className="music-track-controls">
          <button className="music-skip" type="button" onClick={() => changeSong((songIndex - 1 + songs.length) % songs.length)} aria-label="Previous song"><SkipBack size={15} /></button>
          <button className="music-skip" type="button" onClick={() => changeSong((songIndex + 1) % songs.length)} aria-label="Next song"><SkipForward size={15} /></button>
        </div>
        <div className="music-volume-controls">
          <button className="volume-adjust" type="button" onClick={() => changeVolume(volume - 0.05)} aria-label="Lower volume"><Minus size={13} /></button>
          <input aria-label={`Music volume ${Math.round(volume * 100)} percent`} type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} />
          <button className="volume-adjust" type="button" onClick={() => changeVolume(volume + 0.05)} aria-label="Raise volume"><Plus size={13} /></button>
        </div>
      </div>
      {message && <p className="music-message" role="status">{message}</p>}
    </aside>
  );
}
