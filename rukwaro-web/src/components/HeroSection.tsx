import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Car,
  Search,
  ArrowRight,
  ShieldCheck,
  Play,
  Pause,
  ChevronDown,
} from 'lucide-react';
import { Vehicle } from '../types';
import { POPULAR_VEHICLES } from '../data/mockData';

interface HeroSectionProps {
  onSelectVehicle: (v: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

/* ------------------------------------------------------------------ */
/* Count-up hook for trust metrics                                     */
/* ------------------------------------------------------------------ */
const useCountUp = (target: number, duration: number = 1400): number => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const TrustMetric: React.FC<{
  value: number;
  suffix?: string;
  label: string;
  accent?: boolean;
}> = ({ value, suffix = '', label, accent = false }) => {
  const animated = useCountUp(value);
  return (
    <div>
      <div className={`text-2xl font-black ${accent ? 'text-brand-red' : 'text-white'}`}>
        {animated.toLocaleString('en-US')}
        {suffix}
      </div>
      <div className="text-[11px] text-gray-300">{label}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Live stock ticker content                                           */
/* ------------------------------------------------------------------ */
const STOCK_ITEMS = [
  'Bi-LED Headlamps',
  'Tail Lamps',
  'Replacement Lenses',
  'Bumpers & Grills',
  'Inner Fenders',
  'Mudflaps',
  'Engine Oils',
  'ATF Fluids',
  'Toyota Fielder NZE161',
  'Isuzu D-Max',
  'Mazda CX-5',
  'Nissan Juke F15',
  'Hiace KDH200',
  'Ford Ranger T6',
];

const StockTicker: React.FC = () => {
  const half = (keyPrefix: string, ariaHidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={ariaHidden}
    >
      {STOCK_ITEMS.map((item, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          className="flex items-center gap-3 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-white/85"
        >
          {item}
          <span className="h-1 w-1 rounded-full bg-brand-red/90" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/45 backdrop-blur-md">
      <div className="flex items-stretch">
        {/* Fixed live badge */}
        <div className="flex shrink-0 items-center gap-2 border-r border-white/10 px-4 py-2.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="whitespace-nowrap text-[10px] font-black tracking-[0.22em] text-white">
            LIVE STOCK
          </span>
        </div>
        {/* Scrolling track (two mirrored halves for a seamless loop) */}
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee py-2.5 hover:[animation-play-state:paused]">
            {half('a', false)}
            {half('b', true)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectVehicle,
  selectedVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<'vehicle' | 'chassis'>('vehicle');
  const [selectedMake, setSelectedMake] = useState<string>('Toyota');
  const [selectedModel, setSelectedModel] = useState<string>('Corolla Fielder');
  const [chassisInput, setChassisInput] = useState<string>('');
  const [chassisMatchResult, setChassisMatchResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [allowVideo, setAllowVideo] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced-motion and data-saver: show poster, don't stream.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as any).connection;
    const saveData = Boolean(connection?.saveData);

    if (reduceMotion || saveData) {
      setAllowVideo(false);
      setIsPlaying(false);
      return;
    }

    const tryPlay = () => {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    tryPlay();

    // Pause when the tab is hidden (battery / bandwidth friendly).
    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Pause when the hero scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(video);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, []);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Filter models based on selected make
  const availableMakes = Array.from(new Set(POPULAR_VEHICLES.map(v => v.make)));
  const availableModels = POPULAR_VEHICLES.filter(v => v.make === selectedMake);

  const handleApplyVehicle = () => {
    const found = POPULAR_VEHICLES.find(
      v => v.make === selectedMake && v.model === selectedModel
    );
    if (found) {
      onSelectVehicle(found);
    }
  };

  const handleChassisSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chassisInput.trim()) return;

    const query = chassisInput.trim().toUpperCase();
    const match = POPULAR_VEHICLES.find(
      v => v.chassisCode.toUpperCase().includes(query) || query.includes(v.make.toUpperCase()) || query.includes(v.model.toUpperCase())
    );

    if (match) {
      setChassisMatchResult(`Found exact match: ${match.years} ${match.make} ${match.model} (${match.chassisCode})`);
      onSelectVehicle(match);
    } else {
      setChassisMatchResult(`Searching master database for "${query}". Our parts specialist is checking compatibility.`);
    }
  };

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-brand-charcoal overflow-hidden">

      {/* 1. LIVE HERO BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {allowVideo ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/hero-day-poster.jpg"
            onPlaying={() => setVideoReady(true)}
            className={`w-full h-full object-cover object-center filter contrast-105 saturate-[1.05] transition-opacity duration-700 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Mobile stream served on small screens */}
            <source src="/hero-day-driving-720.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/hero-day-driving.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/hero-day-poster.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Day-scene scrims: left darkening for text legibility, warm overall cast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 via-transparent to-brand-charcoal/20" />

        {/* Golden sun-flare sweep — ties the daylight scene to the brand's energy */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 w-[45vw] animate-beam"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,235,190,0.07), rgba(255,228,170,0.16), rgba(255,235,190,0.07), transparent)',
              animationDelay: '1.6s',
            }}
          />
        </div>

        {/* Subtle Brand Red Glow on top-left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />

        {/* Video Play/Pause Toggle */}
        {allowVideo && (
          <button
            onClick={toggleVideoPlay}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/75 backdrop-blur-md text-white p-2 rounded-full border border-white/20 transition-all"
            title={isPlaying ? "Pause video" : "Play video"}
            aria-label="Toggle Hero Video"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-brand-red" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        )}
      </div>

      {/* 2. HERO CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24 lg:pt-20 lg:pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Brand Hero Title & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-white">

            {/* Pill Tag */}
            <div className="inline-flex animate-rise items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-200" style={{ animationDelay: '0.05s' }}>
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
              <span>Kenya's #1 Franchise for Vehicle Lighting & Genuine Spares</span>
            </div>

            {/* Main Headline — kinetic staggered reveal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
              <span className="block animate-rise" style={{ animationDelay: '0.15s' }}>
                PRECISION PARTS.
              </span>
              <span className="headline-accent block text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-red-400">
                PEAK PERFORMANCE.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-rise text-base sm:text-lg text-gray-100 max-w-xl font-normal leading-relaxed" style={{ animationDelay: '0.45s' }}>
              Equip your car with optical-grade <strong>headlamps & tail lamps</strong>, cost-saving <strong>replacement lenses</strong>, heavy-duty <strong>bumpers, grilles, inner fenders, mudflaps</strong>, and genuine <strong>engine oils</strong>. Built for Kenyan roads.
              <span className="block mt-2 text-sm text-gray-300 font-semibold">Genuine or we tell you straight — bei iko wazi, no brokers.</span>
            </p>

            {/* Quick Fleet Highlights */}
            <div className="animate-rise flex flex-wrap items-center gap-2 text-xs text-gray-300" style={{ animationDelay: '0.55s' }}>
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">Specialized In:</span>
              {['Isuzu D-Max', 'Mazda CX-5 & Demio', 'Toyota Fielder', 'Corolla AE110/111', 'Nissan Juke', 'Hiace Shark'].map((car, idx) => (
                <span
                  key={idx}
                  className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md border border-white/15 text-gray-100 font-medium cursor-pointer transition-colors"
                >
                  {car}
                </span>
              ))}
            </div>

            {/* Trust Metrics (count-up) */}
            <div className="animate-rise grid grid-cols-3 gap-4 pt-2 border-t border-white/15 max-w-lg" style={{ animationDelay: '0.65s' }}>
              <TrustMetric value={100} suffix="%" label="OEM Fitment Guarantee" />
              <TrustMetric value={15} suffix=" Min" label="Kirinyaga Rd Pickup" accent />
              <TrustMetric value={1200} suffix="+" label="Lighting & Body Spares" />
            </div>

          </div>

          {/* Right Column: "RUKWARO FASTFIT SELECTOR" (Interactive Filter Card) */}
          <div className="lg:col-span-5 animate-rise" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-2xl shadow-elevated border border-gray-100 p-6 sm:p-7 relative overflow-hidden">

              {/* Header with Red Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-red via-red-600 to-brand-charcoal" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-brand-charcoal tracking-tight flex items-center gap-2">
                    <Car className="w-5 h-5 text-brand-red" />
                    FastFit Vehicle Filter
                  </h3>
                  <p className="text-xs text-gray-500">
                    Find guaranteed matching parts for your car
                  </p>
                </div>
                <span className="bg-red-50 text-brand-red text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  Instant Match
                </span>
              </div>

              {/* Tabs: By Vehicle vs By Chassis No */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('vehicle')}
                  className={`flex-1 py-2 text-center rounded-md transition-all ${
                    activeTab === 'vehicle'
                      ? 'bg-white text-brand-charcoal shadow-sm'
                      : 'text-gray-500 hover:text-brand-charcoal'
                  }`}
                >
                  Select By Make & Model
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('chassis')}
                  className={`flex-1 py-2 text-center rounded-md transition-all ${
                    activeTab === 'chassis'
                      ? 'bg-white text-brand-charcoal shadow-sm'
                      : 'text-gray-500 hover:text-brand-charcoal'
                  }`}
                >
                  Chassis / VIN Lookup
                </button>
              </div>

              {activeTab === 'vehicle' ? (
                /* Tab 1: Dropdown Cascades */
                <div className="space-y-3.5">
                  {/* Select Make */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      1. Vehicle Make
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => {
                        setSelectedMake(e.target.value);
                        const firstModel = POPULAR_VEHICLES.find(v => v.make === e.target.value);
                        if (firstModel) setSelectedModel(firstModel.model);
                      }}
                      className="w-full bg-gray-50 border border-brand-lightgray rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-charcoal focus:ring-2 focus:ring-brand-red focus:outline-none"
                    >
                      {availableMakes.map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Model */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      2. Vehicle Model & Chassis Code
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-gray-50 border border-brand-lightgray rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-charcoal focus:ring-2 focus:ring-brand-red focus:outline-none"
                    >
                      {availableModels.map((v) => (
                        <option key={v.id} value={v.model}>
                          {v.model} ({v.chassisCode} - {v.years})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleApplyVehicle}
                    className="w-full mt-2 bg-brand-red hover:bg-brand-redHover text-white py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-brand transition-all active:scale-[0.99]"
                  >
                    <span>View Guaranteed Compatible Parts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Tab 2: Chassis Lookup */
                <form onSubmit={handleChassisSearch} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Enter Chassis / Frame Code or VIN
                    </label>
                    <input
                      type="text"
                      value={chassisInput}
                      onChange={(e) => setChassisInput(e.target.value)}
                      placeholder="e.g. NZE161, TFR85, KDH200, F15, AE110..."
                      className="w-full bg-gray-50 border border-brand-lightgray rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-charcoal placeholder-gray-400 focus:ring-2 focus:ring-brand-red focus:outline-none uppercase"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Found on your Kenyan logbook, engine bay plate, or insurance sticker.
                    </span>
                  </div>

                  {chassisMatchResult && (
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-md text-xs text-green-800 flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{chassisMatchResult}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 bg-brand-charcoal hover:bg-black text-white py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Search className="w-4 h-4 text-brand-red" />
                    <span>Lookup Chassis In Catalog</span>
                  </button>
                </form>
              )}

              {/* Guarantee footer inside card */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>Exact Fit Bolt-On Guarantee</span>
                </div>
                <a
                  href="https://wa.me/254728707344?text=Hi%20Rukwaro,%20help%20me%20confirm%20parts%20for%20my%20car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red font-semibold hover:underline"
                >
                  Need Help? WhatsApp
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex justify-center mt-10 text-white/60">
          <ChevronDown className="w-5 h-5 animate-cue" aria-hidden="true" />
        </div>
      </div>

      {/* 3. LIVE STOCK TICKER */}
      <StockTicker />

    </section>
  );
};
