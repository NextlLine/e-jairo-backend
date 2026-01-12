const addressEntityTypes = {
  PATIENT: "PATIENT",
  UNITY: "UNITY",
} as const;

export type AddressEntityType = typeof addressEntityTypes[keyof typeof addressEntityTypes];