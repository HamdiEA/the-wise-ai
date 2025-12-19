import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

const VideoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // FIXED: Paths now point to the root (public folder) 
  // and match standard web naming conventions.
  const videos = [
    {
      src: "/reel1.mp4", 
      title: "The Wise Experience"
    },
    {
      src: "/story.mp4", 
      title: "Our Story"
    }
  ];

  useEffect(() => {
    const videosElements = videoRefs.current;
    const currentVideo = videosElements[currentSlide];
    
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play().catch(e => console.log("Autoplay failed:", e));
      } else {
        currentVideo.pause();
      }
    }

    // Pause other videos
    videosElements.forEach((video, index) => {
      if (index !== currentSlide && video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentSlide, isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        nextSlide();
      }
    }, 15000); // Change slide every 15 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{pointerEvents: "auto"}}>
      {/* Decorative holiday lights removed for clean edges */}
      {/* Video slides */}
      <div className="relative w-full h-full overflow-hidden" style={{pointerEvents: "auto"}}>
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{pointerEvents: "none"}}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.src}
              className="w-full h-full object-cover"
              muted // Crucial for Vercel/Chrome autoplay
              loop
              playsInline // Crucial for mobile support
              preload={index === 0 ? "auto" : "none"}
              loading="lazy"
              onEnded={() => {
                if (isPlaying) {
                  nextSlide();
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" style={{pointerEvents: "none"}}
            ></div>
          </div>
        ))}
      </div>

      {/* Play/Pause button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePlayPause();
        }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 50,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;