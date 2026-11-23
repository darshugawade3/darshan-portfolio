
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("Firebase Project ID is missing");
}

const adminApp =
  getApps().length === 0
    ? initializeApp({ projectId })
    : getApps()[0];

const adminAuth = getAuth(adminApp);

export async function verifyAdminRequest(req: Request) {
  const authorization = req.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      !allowedEmail ||
      decoded.email?.toLowerCase() !== allowedEmail
    ) {
      return Response.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    return null;
  } catch {
    return Response.json(
      { error: "Invalid or expired authentication token" },
      { status: 401 }
    );
  }
}
