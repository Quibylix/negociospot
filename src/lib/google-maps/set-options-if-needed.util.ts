import { setOptions } from "@googlemaps/js-api-loader";

export function setOptionsIfNeeded() {
  const globalForMaps = global as unknown as {
    mapsOptionsSet?: boolean;
  };
  if (!globalForMaps.mapsOptionsSet) {
    setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY });
    globalForMaps.mapsOptionsSet = true;
  }
}
