"use client";

import { useEffect, useRef, useState } from "react";

type Address = { street: string; city: string; province: string; postalCode: string; country: string; formattedAddress: string };
type Suggestion = { description: string; place_id: string };
type AddressComponent = { long_name: string; types: string[] };
type PlaceResult = { formatted_address?: string; address_components?: AddressComponent[] };
type GoogleMaps = {
  maps?: {
    LatLng: new (lat: number, lng: number) => unknown;
    places: {
      AutocompleteService: new () => { getPlacePredictions: (request: unknown, callback: (results: Suggestion[] | null) => void) => void };
      PlacesService: new (element: HTMLElement) => { getDetails: (request: unknown, callback: (place: PlaceResult | null) => void) => void };
    };
  };
};

declare global { interface Window { google?: GoogleMaps } }

export function AddressAutocomplete({ value, onChange, onSelect, hasError }: { value: string; onChange: (value: string) => void; onSelect: (address: Address) => void; hasError: boolean }) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [ready, setReady] = useState(() => typeof window !== "undefined" && Boolean(window.google?.maps?.places));
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!key) return;
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-places="true"]');
    if (existing) { existing.addEventListener("load", () => setReady(true)); return () => existing.removeEventListener("load", () => setReady(true)); }
    const script = document.createElement("script"); script.dataset.googlePlaces = "true"; script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`; script.async = true; script.onload = () => setReady(true); document.head.appendChild(script);
  }, [key]);

  useEffect(() => { const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setSuggestions([]); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);

  const updateSuggestions = (nextValue: string) => {
    onChange(nextValue); setActiveIndex(-1);
    if (!ready || nextValue.trim().length < 3) { setSuggestions([]); return; }
    const maps = window.google?.maps;
    if (!maps?.places) return;
    new maps.places.AutocompleteService().getPlacePredictions({ input: nextValue, componentRestrictions: { country: "ca" }, location: new maps.LatLng(50.4452, -104.6189), radius: 50000 }, (results) => setSuggestions(results || []));
  };
  const choose = (suggestion: Suggestion) => {
    const maps = window.google?.maps;
    if (!maps?.places) return;
    const service = new maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: suggestion.place_id, fields: ["formatted_address", "address_components"] }, (place) => {
      const components = place?.address_components || []; const part = (type: string) => components.find((item) => item.types.includes(type))?.long_name || "";
      const street = [part("street_number"), part("route")].filter(Boolean).join(" ") || place?.formatted_address || suggestion.description;
      onSelect({ street, city: part("locality") || part("postal_town"), province: part("administrative_area_level_1"), postalCode: part("postal_code"), country: part("country") || "Canada", formattedAddress: place?.formatted_address || suggestion.description }); setSuggestions([]);
    });
  };
  return <div className="relative z-20" ref={root}>
    <input value={value} onChange={(event) => updateSuggestions(event.target.value)} onKeyDown={(event) => { if (!suggestions.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); } if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); choose(suggestions[activeIndex]); } if (event.key === "Escape") setSuggestions([]); }} className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-red-400 ${hasError ? "border-red-400" : "border-white/10"}`} placeholder="Start typing your street address" autoComplete="street-address" role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls="address-suggestions" />
    {suggestions.length ? <ul id="address-suggestions" className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-white/15 bg-white py-1 shadow-2xl shadow-black/50" role="listbox">{suggestions.map((suggestion, index) => <li key={suggestion.place_id}><button type="button" className={`w-full px-4 py-3 text-left text-sm text-stone-900 hover:bg-red-50 focus:bg-red-50 focus:outline-none ${index === activeIndex ? "bg-red-50" : ""}`} role="option" aria-selected={index === activeIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(suggestion)}>{suggestion.description}</button></li>)}</ul> : null}
    {!key ? <p className="mt-2 text-xs text-stone-500">You may enter your address manually.</p> : null}
  </div>;
}
