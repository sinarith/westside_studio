import React,{useMemo,useState} from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Estimator from './components/Estimator';
import Gallery from './components/Gallery';
import Process from './components/Process';
import Booking from './components/Booking';
import Lightbox from './components/Lightbox';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import {packages,addons} from './data/pricing';
import './styles.css';
export default function App(){const [menu,setMenu]=useState(false),[selected,setSelected]=useState('gang'),[people,setPeople]=useState(8),[lightroom,setLightroom]=useState(false),[video,setVideo]=useState(false),[lightbox,setLightbox]=useState(null);const pkg=packages.find(p=>p.id===selected);const total=useMemo(()=>video?15:(pkg?.price||10)+Math.max(0,people-8)+(lightroom?2:0),[pkg,people,lightroom,video]);const choose=id=>{setSelected(id);setVideo(false);setPeople(packages.find(p=>p.id===id)?.people||8)};return <div className="app"><div className="site-sparkles" aria-hidden="true">{Array.from({length:64},(_,i)=><span key={i} style={{'--x':`${(i*37+13)%100}%`,'--y':`${(i*61+11)%100}%`,'--size':i%7===0?'3px':'2px','--duration':`${5+(i%7)}s`,'--delay':`-${i%9}s`,'--drift':`${i%2===0?'-':'+'}${7+(i%17)}px`}} />)}</div><Header menu={menu} setMenu={setMenu}/><main><Hero/><Services/><Pricing packages={packages} selected={selected} video={video} choose={choose} setVideo={setVideo}/><Estimator packages={packages} addons={addons} selected={selected} people={people} setPeople={setPeople} lightroom={lightroom} setLightroom={setLightroom} video={video} total={total}/><Gallery setLightbox={setLightbox}/><Process/><Booking video={video} selected={selected} setVideo={setVideo} choose={choose} total={total}/></main><Footer/><Lightbox item={lightbox} setItem={setLightbox}/><MusicPlayer/></div>}
