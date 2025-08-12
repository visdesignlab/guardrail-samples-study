declare module 'seedrandom' {
  interface PRNG {
    (): number;
    double(): number;
    int32(): number;
    quick(): number;
  }
  interface SeedRandomOptions {
    entropy?: boolean;
  }
  function seedrandom(seed?: string | number, options?: SeedRandomOptions): PRNG;
  export default seedrandom;
}
