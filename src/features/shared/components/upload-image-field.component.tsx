import { Group, Text } from "@mantine/core";
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  type DropzoneProps,
  DropzoneReject,
  type IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

export type UploadImageFieldProps = {
  name: string;
  label: string;
  labelDescription?: string;
  multiple?: boolean;
  accept?: typeof IMAGE_MIME_TYPE;
  maxSize?: number;
  loading?: boolean;
  onChange: (files: File[]) => void;
  onReject?: DropzoneProps["onReject"];
};

export function UploadImageField({
  label,
  labelDescription,
  name,
  multiple,
  accept,
  maxSize,
  loading,
  onChange,
  onReject,
}: UploadImageFieldProps) {
  return (
    <Dropzone
      loading={loading}
      name={name}
      onDrop={onChange}
      onReject={onReject}
      maxSize={maxSize}
      accept={accept}
      multiple={multiple}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <DropzoneAccept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </DropzoneAccept>
        <DropzoneReject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </DropzoneReject>
        <DropzoneIdle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </DropzoneIdle>
        <div>
          <Text size="xl" inline>
            {label}
          </Text>
          {labelDescription && (
            <Text size="sm" c="dimmed" inline mt={7}>
              {labelDescription}
            </Text>
          )}
        </div>
      </Group>
    </Dropzone>
  );
}
