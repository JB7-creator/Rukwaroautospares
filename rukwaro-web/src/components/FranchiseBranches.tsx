import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Store } from 'lucide-react';
import { Branch } from '../types';
import { BRANCHES } from '../data/mockData';

interface FranchiseBranchesProps {
  selectedBranch: Branch;
  onSelectBranch: (b: Branch) => void;
}

export const FranchiseBranches: React.FC<FranchiseBranchesProps> = ({
  selectedBranch,
  onSelectBranch,
}) => {
  return (
    <section id="branches" className="py-16 bg-white border-b border-brand-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>Omnichannel Franchise Network</span>
          </div>
          <h2 className="text-3xl font-black text-brand-charcoal tracking-tight">
            Our Nairobi Branches & Pickup Hubs
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Order online and pick up in 15 minutes, or get same-day courier delivery to your garage or doorstep anywhere in Nairobi & environs.
          </p>
        </div>

        {/* 3 Branches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRANCHES.map((branch) => {
            const isSelected = selectedBranch.id === branch.id;
            return (
              <div
                key={branch.id}
                className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-red ring-2 ring-brand-red/20 shadow-brand bg-red-50/20'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-card bg-white'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-red block mb-1">
                        {branch.area}
                      </span>
                      <h3 className="text-lg font-black text-brand-charcoal">
                        {branch.name}
                      </h3>
                    </div>
                    {isSelected && (
                      <span className="bg-brand-red text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                        Selected Hub
                      </span>
                    )}
                  </div>

                  {/* Highlights / Specialties */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs font-semibold text-gray-700">
                    {branch.highlight}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-2.5 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{branch.hours}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-bold">
                    <Phone className="w-4 h-4 text-brand-red shrink-0" />
                    <span>{branch.phone}</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-100 mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => onSelectBranch(branch)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-brand-red text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-brand-charcoal'
                    }`}
                  >
                    {isSelected ? 'Default Pickup Hub Selected' : 'Set as My Pickup Hub'}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-brand-charcoal hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-red" />
                      <span>Call Hub</span>
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=Hello%20Rukwaro%20${encodeURIComponent(branch.name)},%20I'd%20like%20to%20inquire%20about%20parts`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
