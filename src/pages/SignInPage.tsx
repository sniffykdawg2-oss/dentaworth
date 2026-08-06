import { AuthUser } from "../backend/auth";
import { AuthGatewayPage } from "./AuthGatewayPage";

export function SignInPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  const authAction = new URLSearchParams(window.location.search).get("action");

  return (
    <AuthGatewayPage
      authUser={authUser}
      initialStep={authAction === "create-account" ? "create-account" : "audience"}
      navigate={navigate}
    />
  );
}
