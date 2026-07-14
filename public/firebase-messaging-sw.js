// This snippet is required to allow Firebase Cloud Messaging to run in the background
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// We use an initialization trick: the client will pass config to this SW via URL query params 
// when registering it, or we can hardcode it here if the project config is public.
// But to keep it secure-ish and avoid hardcoding, we wait for a message from the client.

let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_FIREBASE_SW') {
    const firebaseConfig = event.data.config;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();
      
      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        const notificationTitle = payload.notification?.title || 'Nuevo Mensaje';
        const notificationOptions = {
          body: payload.notification?.body,
          icon: '/favicon.ico',
          data: payload.data, // Contains click_action and url
        };
      
        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    }
  }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            const targetUrl = event.notification.data?.url || '/';
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
