import React from 'react';

const Features = () => {
    const featureList = [
        {
            icon: <i className="fas fa-gem text-3xl mb-3 text-[#1e3066]"></i>,
            title: "Premium Fabrics",
        },
        {
            icon: <i className="fas fa-cut text-3xl mb-3 text-[#1e3066]"></i>,
            title: "Elegant Designs",
        },
        {
            icon: <i className="fas fa-ruler-combined text-3xl mb-3 text-[#1e3066]"></i>,
            title: "Comfort Fit",
        },
        {
            icon: <i className="fas fa-star text-3xl mb-3 text-[#1e3066]"></i>,
            title: "Trusted Quality",
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {featureList.map((feature, index) => (
                        <div 
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 active:bg-gray-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
                        >
                            {/* Icon Container with touch/hover scale */}
                            <div className="transform transition-transform duration-300 group-hover:scale-110">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-sans font-bold text-[#1e3066] tracking-wide text-center">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;