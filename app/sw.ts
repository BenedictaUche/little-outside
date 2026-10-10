
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (Array<{
      url: string;
      revision: string | null;
    }>) | undefined;
  }
}

declare const self: WorkerGlobalScope & {
  __SW_MANIFEST: (Array<{
    url: string;
    revision: string | null;
  }>) | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
