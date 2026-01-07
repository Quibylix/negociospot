import { ActionIcon, Box, LoadingOverlay } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useMapPicker } from "./use-map-picker.hook";

type MapPickerProps = {
  value?: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number } | null) => void;
  defaultCenter?: { lat: number; lng: number };
  deleteMarkerTitle?: string;
};

const DEFAULT_CENTER = { lat: 13.6929, lng: -89.2182 };

export function MapPicker({
  value,
  onChange,
  defaultCenter = DEFAULT_CENTER,
  deleteMarkerTitle,
}: MapPickerProps) {
  const { mapRef, map, clearMarker } = useMapPicker({
    center: value || defaultCenter,
    initiallySelectedPosition: value || undefined,
    onChange,
  });

  return (
    <Box pos="relative" h={400} w="100%">
      <LoadingOverlay
        visible={!map}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {value && (
        <ActionIcon
          color="red"
          variant="filled"
          pos="absolute"
          top={10}
          right={10}
          style={{ zIndex: 10 }}
          onClick={clearMarker}
          title={deleteMarkerTitle}
        >
          <IconX size={18} />
        </ActionIcon>
      )}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      />
    </Box>
  );
}
