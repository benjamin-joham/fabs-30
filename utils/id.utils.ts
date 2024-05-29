let globalUid = 0;

/**
 * Returns a project scope unique ID.
 */
export const uid = () => {
  globalUid += 1;

  return globalUid;
};
