import { AuthUser } from "../backend/auth";
import { AuthGatewayPage } from "./AuthGatewayPage";

export function SignInPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  return <AuthGatewayPage authUser={authUser} navigate={navigate} />;
}
