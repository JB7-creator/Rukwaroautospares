import React, { useState } from 'react';
import { X, Car, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';
import { POPULAR_VEHICLES } from '../data/mockData';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle) => void;
  onClearVehicle: () => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onSelectVehicle,
  onClearVehicle,
}) => {
  const [filterSearch, setFilterSearch] = useState('');

  if (!isOpen) return null;

  const filteredVehicles = POPULAR_VEHICLES.filter(v => 
    v.make.toLowerCase().includes(filterSearch.toLowerCase()) ||
    v.model.toLowerCase().includes(filterSearch.toLowerCase()) ||
    v.chassisCode.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-elevated border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <Car className="w-6 h-6 text-brand-red" />
          <h3 className="text-xl font-black text-brand-charcoal">
            Rukwaro Virtual Garage
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Select your vehicle to activate 100% Exact Fitment filtering across all headlamps, lenses, bumpers, inner liners, mudflaps, and lubricants.
        </p>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search by model or chassis (e.g. Fielder, D-Max, AE110, CX-5, Juke)..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-brand-lightgray rounded-lg text-xs font-semibold text-brand-charcoal focus:ring-2 focus:ring-brand-red focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Vehicles Grid */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
          {filteredVehicles.map((vehicle) => {
            const isCurrent = selectedVehicle?.id === vehicle.id;
            return (
              <div
                key={vehicle.id}
                onClick={() => {
                  onSelectVehicle(vehicle);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-brand-red bg-red-50/70 text-brand-charcoal shadow-sm'
                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-brand-charcoal">
                      {vehicle.years} {vehicle.make} {vehicle.model}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded">
                      {vehicle.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    Chassis: <strong>{vehicle.chassisCode}</strong> &bull; {vehicle.engine}
                  </div>
                </div>

                {isCurrent ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-charcoal shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Clear selection footer */}
        {selectedVehicle && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Active: <strong>{selectedVehicle.make} {selectedVehicle.model}</strong>
            </span>
            <button
              onClick={() => {
                onClearVehicle();
                onClose();
              }}
              className="text-brand-red font-bold hover:underline"
            >
              Clear Vehicle Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
