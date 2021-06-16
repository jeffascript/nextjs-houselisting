import * as admin from "firebase-admin";
import { NextApiRequest } from "next";

const verifiedIdToken = async (token: string) => {
  //got type from vscode intelli..
  /*****
   ***  nullish coalescing operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
   ***  ==> if( process.env.FIREBASE_PRIVATE_KEY === null || undefined) return ""
   *****/
  const firebasePrivateKey: string = process.env.FIREBASE_PRIVATE_KEY ?? "";

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey.replace(/\\n/g, "\n"), // replace the "\n" that we see all over on our process.env.FIREBASE_PRIVATE_KEY we got from firebase, to reduce err while deploying
      }),
    });
  }

  try {
    return admin.auth().verifyIdToken(token);
  } catch (e) {
    return null;
  }
};

/**
 * Our async func. would return a promise that should have a string || null; NextApiRequest is the type for req in Next.js
 */

const loadIdToken = async (req: NextApiRequest): Promise<string | null> => {
  if (!req.cookies.token) return null;

  const decoded = await verifiedIdToken(req.cookies.token); //decoded as in https://jwt.io/#libraries

  if (!decoded) return null;

  return decoded.uid;
};

export { loadIdToken };
