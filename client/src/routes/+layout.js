export const ssr = false;

export const load = (async () => {
  return {
    socket: await import("../socket"),
  };
});
