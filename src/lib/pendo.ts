import { UserInfo } from './userGenerator';

const PENDO_API_KEY = '63d9a79e-c421-4112-8840-e1d865733925';

declare global {
  interface Window {
    pendo: any;
  }
}

export function initializePendo(userInfo: UserInfo) {
  // Load Pendo agent script
  (function (apiKey: string) {
    (function (p: any, e: Document, n: string, d: string, o?: any) {
      let v: string[], w: number, x: string, y: HTMLScriptElement, z: HTMLScriptElement;
      o = p[d] = p[d] || {};
      o._q = [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'trackAgent'];
      for (w = 0; w < v.length; ++w) {
        (function (m: string) {
          o[m] = o[m] || function () {
            o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
          };
        })(v[w]);
      }
      y = e.createElement(n) as HTMLScriptElement;
      y.async = true;
      y.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
      z = e.getElementsByTagName(n)[0] as HTMLScriptElement;
      z.parentNode?.insertBefore(y, z);
    })(window, document, 'script', 'pendo');
  })(PENDO_API_KEY);

  // Initialize with user info - call directly, the snippet queues calls until script loads
  window.pendo.initialize({
    visitor: {
      id: userInfo.visitorId,
      role: userInfo.role,
    },
    account: {
      id: userInfo.account,
    },
  });
}

export function updatePendoVisitor(userInfo: UserInfo) {
  if (window.pendo?.identify) {
    window.pendo.identify({
      visitor: {
        id: userInfo.visitorId,
        role: userInfo.role,
      },
      account: {
        id: userInfo.account,
      },
    });
  }
}
