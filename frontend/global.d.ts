// global.d.ts
interface Window {
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
}
