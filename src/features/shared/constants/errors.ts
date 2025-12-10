import type messages from "@/features/i18n/messages/es.json";

type Path<T extends object> = {
  [K in keyof T]: `${Exclude<K, symbol>}${T[K] extends object ? `.${Path<T[K]>}` : ""}`;
}[keyof T];

type KeyPaths = Path<typeof messages.errors>;

export const ERRORS = {
  AUTH: {
    USER_NOT_FOUND: "auth.user_not_found",
    SERVER_ERROR: "auth.server_error",
    INVALID_CREDENTIALS: "auth.invalid_credentials",
    NO_CODE_PROVIDED: "auth.no_code_provided",
  },
} satisfies Record<string, Record<string, KeyPaths>>;
