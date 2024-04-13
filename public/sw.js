let cacheData = "appV1";

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      return cache.addAll([
        "/static/js/bundle.js",
        "/manifest.json",
        "/mainLogo.png",
        "/forgotPasswordLogo.png",
        "/nameLogo.png",
        "/navbarLogo.png",
        "/resetPasswordLogo.png",
        "/signupLogo.png",
        "/favicon.ico",
        "/logo192.png",
        "/logo512.png",
        "https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap,",
        "/",
        "/chat",
        "/signup",
        "/getRide",
        "/signupDriver",
        "/forgotPassword",
        "/myRequests",
        "/addRide",
        "/currentRides",
      ]);
    })
  );
});


this.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
      if (event.request.url.includes("/driverProfile/")) {
        event.respondWith(
          caches.match(event.request).then((resp) => {
            if (resp) {
              return resp;
            }
            return fetch(event.request).then((fetchResp) => {
              return caches.open(cacheData).then((cache) => {
                cache.put(event.request, fetchResp.clone());
                return fetchResp;
              });
            });
          }).catch((err) => {
            console.error("Error while caching the /driverProfile/ route: ", err );
          })
        );
      } else if (event.request.url.includes("/listingDetail/")) {
        event.respondWith(
          caches.match(event.request).then((resp) => {
            if (resp) {
              return resp;
            }
            return fetch(event.request).then((fetchResp) => {
              return caches.open(cacheData).then((cache) => {
                cache.put(event.request, fetchResp.clone());
                return fetchResp;
              });
            });
          }).catch((err) => {
            console.error("Error while caching the /listingDetail/ route: ", err );
          })
        );
      } else {
        event.respondWith(
          caches.match(event.request).then((resp) => {
            if (resp) {
              return resp;
            }
            return fetch(event.request);
          }).catch(() => {
            console.error("Error while caching: ", err );
          })
        );
      }
    }
  });
  
    // this.addEventListener("fetch", (event) => {
    //   if (!navigator.onLine) {
    //     event.respondWith(
    //       caches.match(event.request).then((resp) => {
    //         if (resp) {
    //           return resp;
    //         }
    //       })
    //     );
    //   }
    // });