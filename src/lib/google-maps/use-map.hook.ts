import { importLibrary } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { setOptionsIfNeeded } from "./set-options-if-needed.util";

export function useMap(center: { lat: number; lng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const init = async () => {
      const { Map: GoogleMap } = await importLibrary("maps");
      const { AdvancedMarkerElement } = await importLibrary("marker");

      if (!mapRef.current) return;

      const instance = new GoogleMap(mapRef.current, {
        center,
        zoom: 14,
        disableDefaultUI: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      });

      new AdvancedMarkerElement({
        map: instance,
        position: center,
      });

      setMap(instance);
    };

    setOptionsIfNeeded();
    init();
  }, [center]);

  return { mapRef, map };
}
