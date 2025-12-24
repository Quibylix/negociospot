import { importLibrary } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import { setOptionsIfNeeded } from "./set-options-if-needed.util";

export function useMapPicker({
  center,
  initiallySelectedPosition,
  onChange,
}: {
  center: { lat: number; lng: number };
  initiallySelectedPosition?: { lat: number; lng: number };
  onChange?: (pos: { lat: number; lng: number } | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  useEffect(() => {
    const init = async () => {
      const { Map: GoogleMap } = await importLibrary("maps");

      if (!mapRef.current) return;

      const instance = new GoogleMap(mapRef.current, {
        center,
        zoom: initiallySelectedPosition ? 12 : 7,
        disableDefaultUI: true,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        draggableCursor: "crosshair",
      });

      setMap(instance);

      if (!initiallySelectedPosition) return;

      setMarkerPosition(initiallySelectedPosition);
      const { AdvancedMarkerElement } = await importLibrary("marker");
      markerRef.current = new AdvancedMarkerElement({
        map: instance,
        position: initiallySelectedPosition,
      });
    };

    setOptionsIfNeeded();
    init();
  }, [center, initiallySelectedPosition]);

  useEffect(() => {
    let listener: google.maps.MapsEventListener;
    const init = async () => {
      if (!map) return;

      const { AdvancedMarkerElement } = await importLibrary("marker");

      listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        setMarkerPosition({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });

        onChange?.({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });

        if (markerRef.current) {
          markerRef.current.position = e.latLng;
        } else
          markerRef.current = new AdvancedMarkerElement({
            map,
            position: e.latLng,
          });
      });
    };

    init();

    return () => {
      listener?.remove();
    };
  }, [map, onChange]);

  function clearMarker() {
    if (markerRef.current) {
      markerRef.current.map = null;
    }
    markerRef.current = null;
    setMarkerPosition(null);
    onChange?.(null);
  }

  return { mapRef, map, markerPosition, clearMarker };
}
