import { Bike, ShoppingCart, MapPin, Route, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Bike,
      title: "Select Your Bike",
      desc: "Search & select a premium ride from our wide arsenal.",
      delay: "100",
    },
    {
      icon: ShoppingCart,
      title: "Add to Cart",
      desc: "Instantly add multiple bikes or direct book via 'BookNow'.",
      delay: "300",
    },
    {
      icon: MapPin,
      title: "Pick Your Bike",
      desc: "Locate the nearest pickup station & grab your keys.",
      delay: "500",
    },
    {
      icon: Route,
      title: "Ride Anywhere",
      desc: "Absolutely no kilometer restrictions. Ride with total freedom.",
      delay: "700",
    }
  ];

  return (
    <section className="bg-slate-50/50 py-32 px-6 relative overflow-hidden border-t border-slate-100">
      {/* Background Graphic elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#ffc800]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Dynamic Header */}
        <div className="flex flex-col items-center mb-24 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter text-center">
            How To Rent in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc800] to-yellow-600">Kanpur?</span>
          </h2>
        </div>

        {/* Slanted Creative Layout container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 w-full">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="group relative pt-12">
                
                {/* Number Background */}
                <div className="absolute top-0 right-4 md:right-auto md:left-4 text-9xl font-black text-slate-200/50 -z-10 group-hover:text-[#ffc800]/20 transition-colors duration-500 italic tracking-tighter">
                  0{i + 1}
                </div>

                {/* The Skewed Card block */}
                <div className="relative -skew-x-[10deg] bg-white border-2 border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(255,200,0,0.15)] hover:border-[#ffc800] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col p-8">
                  
                  {/* Outer corner fold accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-slate-50 border-b-2 border-l-2 border-slate-100 group-hover:border-[#ffc800] transition-colors group-hover:bg-[#ffc800]"></div>

                  {/* Anti-skew Inner Content wrapper */}
                  <div className="skew-x-[10deg] flex flex-col h-full z-10 relative">
                    
                    {/* Floating Icon Box */}
                    <div className="w-16 h-16 bg-slate-900 -mt-16 mb-8 flex items-center justify-center transform group-hover:-rotate-6 transition-transform duration-500 shadow-xl border-2 border-slate-800">
                      <Icon className="w-8 h-8 text-[#ffc800]" strokeWidth={2} />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-[#ffc800] transition-colors">
                      {step.title}
                    </h3>
                    
                    <div className="w-12 h-1 bg-slate-200 mb-4 group-hover:bg-slate-900 group-hover:w-full transition-all duration-500"></div>

                    <p className="text-sm font-bold text-slate-500 leading-relaxed group-hover:text-slate-700">
                      {step.desc}
                    </p>
                  </div>
                </div>
                
                {/* Connecting Arrow for Desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[60%] -right-8 z-20 text-slate-300 group-hover:text-[#ffc800] group-hover:translate-x-2 transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
