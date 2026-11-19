import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { firebaseConfig } from '../lib/firebase-config';

// Notification payload is displayed by FCM. No second showNotification() call.
if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  getMessaging(initializeApp(firebaseConfig));
}
