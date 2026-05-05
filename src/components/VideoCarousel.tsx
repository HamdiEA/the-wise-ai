import { useState, useEffect, useRef } from "react";

const VideoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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
      currentVideo.play().catch(() => {
        // Browser autoplay policies can block playback until user interaction.
      });
    }

    // Pause other videos
    videosElements.forEach((video, index) => {
      if (index !== currentSlide && video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videos.length);
    }, 15000); // Change slide every 15 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

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
              className="w-full h-full object-cover animate-ken-burns"
              muted // Crucial for Vercel/Chrome autoplay
              loop
              playsInline // Crucial for mobile support
              preload={index === 0 ? "auto" : "metadata"}
              onEnded={() => {
                nextSlide();
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" style={{pointerEvents: "none"}}
            ></div>
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-primary w-8 shadow-glow"
                : "bg-foreground/40 hover:bg-primary/70 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
