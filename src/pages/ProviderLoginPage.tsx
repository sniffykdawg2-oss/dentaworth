import { AuthUser } from "../backend/auth";
import { AuthGatewayPage } from "./AuthGatewayPage";

export function ProviderLoginPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  return <AuthGatewayPage authUser={authUser} initialAudience="provider" navigate={navigate} />;
}
