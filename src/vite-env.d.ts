interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | undefined;
  };
  glob(
    pattern: string,
    options?: { query?: string; eager?: boolean; import?: string }
  ): Record<string, unknown>;
}
