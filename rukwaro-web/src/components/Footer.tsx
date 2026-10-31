import React from 'react';
import { Phone, Mail, MapPin, Globe, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const seoKeywords = [
    'car headlamps kenya',
    'tail lamps for cars',
    'auto spares nairobi',
    'vehicle lighting parts',
    'toyota spare parts',
    'isuzu auto parts',
    'ford ranger parts',
    'nissan dmax parts',
    'hiace parts kenya',
    'car accessories kenya',
    'best auto parts shop nairobi',
    'rukwaro autospare',
    'ntsa inspection headlights',
    'pay on delivery auto parts',
    'mazda cx5 parts kenya',
    'replacement headlight lens nairobi',
  ];

  return (
    <footer className="bg-white border-t border-brand-lightgray pt-16 pb-12 text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-gray-100">
          
          {/* Col 1 & 2: Brand Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-mark.png" 
                alt="Rukwaro Logo Mark" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="text-2xl font-black text-brand-red tracking-tight leading-none">
                  RUKWARO
                </div>
                <div className="text-[10px] font-bold tracking-[0.25em] text-brand-charcoal uppercase leading-tight">
                  AUTOSPARES
                </div>
                <div className="text-[9px] font-medium text-gray-500">
                  Precision Parts. Peak Performance.
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              <strong>Our Mission:</strong> To provide high-quality, reliable and durable vehicle lighting and auto parts that keep you moving — safely, confidently and without compromise.
            </p>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
              <strong className="text-brand-charcoal block mb-0.5">Our Vision:</strong>
              To be Kenya's most trusted auto spares brand, known for quality, reliability, and exceptional customer service.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a 
                href="https://wa.me/254728707344"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
                aria-label="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="tel:0728707344"
                className="bg-brand-charcoal text-white p-2 rounded-lg hover:bg-black transition-colors"
                aria-label="Direct Call"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
              Core Specialty Lines
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#lighting" className="hover:text-brand-red transition-colors">Bi-LED & Halogen Headlamps</a></li>
              <li><a href="#lighting" className="hover:text-brand-red transition-colors">LED Combination Tail Lamps</a></li>
              <li><a href="#lighting" className="hover:text-brand-red transition-colors">UV-Hardcoat Replacement Lenses</a></li>
              <li><a href="#body" className="hover:text-brand-red transition-colors">Front & Rear Bumpers</a></li>
              <li><a href="#body" className="hover:text-brand-red transition-colors">Honeycomb Radiator Grills</a></li>
              <li><a href="#body" className="hover:text-brand-red transition-colors">Inner Fender Splash Liners</a></li>
              <li><a href="#body" className="hover:text-brand-red transition-colors">Heavy-Duty Mudflaps (4-Pack)</a></li>
              <li><a href="#oils" className="hover:text-brand-red transition-colors">Genuine Engine Oils (5W-30 / 15W-40)</a></li>
            </ul>
          </div>

          {/* Col 4: Popular Vehicle Fleets */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
              Fleet Compatibility
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><span>Toyota Corolla Fielder (NZE161/164)</span></li>
              <li><span>Isuzu D-Max (TFR85 / RT50 / RG01)</span></li>
              <li><span>Mazda CX-5 (KE & KF Series)</span></li>
              <li><span>Mazda Demio (DJ3FS / DE3FS)</span></li>
              <li><span>Toyota Corolla AE110 / AE111</span></li>
              <li><span>Nissan Juke (F15 Series)</span></li>
              <li><span>Toyota Hiace KDH200 (Shark)</span></li>
              <li><span>Ford Ranger (T6 / PX Series)</span></li>
            </ul>
          </div>

          {/* Col 5: Hub Contacts & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
              Nairobi Hubs
            </h4>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div>
                <strong className="text-brand-charcoal block">Downtown Flagship:</strong>
                <span>Kirinyaga Road, Nairobi CBD</span>
              </div>
              <div>
                <strong className="text-brand-charcoal block">Central Depot:</strong>
                <span>Enterprise Road, Industrial Area</span>
              </div>
              <div>
                <strong className="text-brand-charcoal block">Express Store:</strong>
                <span>Mpaka Road, Westlands</span>
              </div>
              <div className="pt-2 text-xs">
                <div className="font-bold text-brand-charcoal">Direct Phones:</div>
                <div className="text-brand-red font-mono font-bold">0728 707 344</div>
                <div className="text-brand-red font-mono font-bold">0712 843 544</div>
                <div className="text-brand-red font-mono font-bold">0782 099 753</div>
              </div>
            </div>
          </div>

        </div>

        {/* SEO Keywords Cloud (As instructed by brand guidelines) */}
        <div className="py-6 border-b border-gray-100">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Target Search Directory:
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
            {seoKeywords.map((kw, i) => (
              <span key={i} className="hover:text-brand-red cursor-pointer transition-colors">
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>&copy; {new Date().getFullYear()} Rukwaro Autospares. All Rights Reserved. Kenya.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="#/terms" className="hover:text-brand-red transition-colors">Terms of Service</a>
            <a href="#/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</a>
            <a href="#/returns" className="hover:text-brand-red transition-colors">Returns & Refunds</a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="#/admin" className="hover:text-brand-red transition-colors">Admin</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
