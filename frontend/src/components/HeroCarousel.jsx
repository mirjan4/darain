import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getHeroSlides, UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

// Static fallback slides (used if no slides are set up in admin)
import slide1 from '../assets/banner.webp';

const FALLBACK_SLIDES = [
    {
        image: slide1,
        subtitle: "Modest • Elegant • Timeless",
        title: "Graceful Abayas\n& Pardhas",
        description: "Discover beautifully designed abayas that combine modesty, comfort, and modern elegance.",
        cta: "Explore Collection",
        link: "/collections"
    }
];

const HeroCarousel = () => {
    const [slides, setSlides] = useState(FALLBACK_SLIDES);
    const [current, setCurrent] = useState(0);
    const [apiLoaded, setApiLoaded] = useState(false);
    const { settings } = useSettings();
    const slideSpeed = parseInt(settings?.slider_interval) || 6000;

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await getHeroSlides();
                const data = res.data.data || [];
                if (data.length > 0) {
                    // Map API slides to the format the carousel expects
                    const mapped = data.map(slide => ({
                        image: slide.image ? `${UPLOADS_BASE_URL}/${slide.image}` : slide1,
                        subtitle: slide.subtitle || '',
                        title: slide.title || '',
                        description: slide.description || '',
                        cta: 'Explore Collection',
                        link: '/collections',
                    }));
                    setSlides(mapped);
                }
            } catch (e) {
                // Silently fall back to static slides if API fails
            } finally {
                setApiLoaded(true);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, slideSpeed);
        return () => clearInterval(timer);
    }, [slides, slideSpeed]);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <section className="relative h-[85vh] lg:h-[80vh] w-full bg-[#fcfcfc] overflow-hidden group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div className="flex flex-col-reverse lg:flex-row w-full h-full">
                        
                        {/* Text Content (Left Side on Desktop, Bottom on Mobile) */}
                        <div className="w-full lg:w-1/2 h-[50%] lg:h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 bg-white relative z-20 pb-10 lg:pb-0">
                            
                            {/* Subtitle/Tag */}
                            {slide.subtitle && (
                                <div className={`overflow-hidden mb-3 lg:mb-6 transition-all duration-1000 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                    <span className="inline-block uppercase tracking-[0.2em] lg:tracking-[0.4em] text-gray-500 text-[10px] font-sans font-bold">
                                        {slide.subtitle}
                                    </span>
                                </div>
                            )}

                            {/* Heading */}
                            <div className={`overflow-hidden mb-3 lg:mb-8 transition-all duration-1000 delay-500 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-[#1e3066] leading-[1.1] tracking-tight">
                                    {slide.title.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i === 0 && slide.title.includes('\n') && <br />}
                                        </React.Fragment>
                                    ))}
                                </h1>
                            </div>

                            {/* Description */}
                            {slide.description && (
                                <div className={`overflow-hidden mb-6 lg:mb-12 max-w-md transition-all duration-1000 delay-700 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed font-sans font-medium line-clamp-2 md:line-clamp-none">
                                        {slide.description}
                                    </p>
                                </div>
                            )}

                            {/* CTA Button */}
                            <div className={`flex flex-wrap transition-all duration-1000 delay-1000 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <Link
                                    to={slide.link}
                                    className="group/btn inline-flex items-center gap-4 bg-[#1e3066] text-white pl-6 lg:pl-8 pr-2 py-2 rounded-full font-sans font-bold tracking-[0.2em] uppercase text-[10px] lg:text-[11px] hover:bg-[#152454] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1"
                                >
                                    <span>{slide.cta}</span>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-[#1e3066] transition-all duration-500">
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Image (Right Side on Desktop, Top on Mobile) */}
                        <div className="w-full lg:w-1/2 h-[50%] lg:h-full relative overflow-hidden bg-gray-100">
                            <img
                                src={typeof slide.image === 'string' ? slide.image : slide.image}
                                alt={slide.title.replace('\n', ' ')}
                                className={`w-full h-full object-cover object-top transition-transform duration-[10000ms] ease-out ${index === current ? 'scale-110' : 'scale-100'}`}
                            />
                            <div className="absolute inset-0 bg-black/5"></div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-[25%] lg:top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[#1e3066] hover:bg-white hover:text-[#152454] shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 -translate-x-4 group-hover:translate-x-0 focus:outline-none hidden md:flex"
            >
                <ChevronLeft size={20} strokeWidth={2} className="ml-0.5" />
            </button>
            
            <button
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-[25%] lg:top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[#1e3066] hover:bg-white hover:text-[#152454] shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 translate-x-4 group-hover:translate-x-0 focus:outline-none hidden md:flex"
            >
                <ChevronRight size={20} strokeWidth={2} className="mr-0.5" />
            </button>

            {/* Elegant Line Indicators */}
            <div className="absolute bottom-5 lg:bottom-10 left-6 sm:left-12 lg:left-32 z-30 flex gap-2.5 items-center">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-700 ease-out rounded-full h-[3px] focus:outline-none ${
                            i === current
                            ? 'w-10 lg:w-12 bg-[#1e3066]'
                            : 'w-4 lg:w-6 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
