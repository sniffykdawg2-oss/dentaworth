import { useEffect, useState } from "react";
import { getCurrentPage, Page, routeTitles } from "./nav";
import { AuthUser, subscribeToAuth } from "./backend/auth";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Disclaimer } from "./components/Disclaimer";
import { DevelopmentBanner } from "./components/DevelopmentBanner";
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { SelfReportingPage } from "./pages/SelfReportingPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { ContactPage } from "./pages/ContactPage";
import { GetCareNowPage } from "./pages/GetCareNowPage";
import { FindADentistPage } from "./pages/FindADentistPage";
import { AdvertiseWithUsPage } from "./pages/AdvertiseWithUsPage";
import { PromotePracticePage } from "./pages/PromotePracticePage";
import { DrugsAZPage } from "./pages/DrugsAZPage";
import { ProviderLoginPage } from "./pages/ProviderLoginPage";
import { NewsPage } from "./pages/NewsPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { BlogPage } from "./pages/BlogPage";
import { SignInPage } from "./pages/SignInPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  const [page, setPage] = useState<Page>(getCurrentPage);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [routeVersion, setRouteVersion] = useState(0);
  const isAuthRoute = page === "sign-in" || page === "provider-login";

  useEffect(() => {
    function handlePopState() {
      setPage(getCurrentPage());
      setRouteVersion((version) => version + 1);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => subscribeToAuth(setAuthUser), []);

  function navigate(href: string) {
    window.history.pushState(null, "", href);
    setPage(getCurrentPage());
    setRouteVersion((version) => version + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageMeta page={page} />
      {!isAuthRoute && <DevelopmentBanner />}
      {!isAuthRoute && <Header currentPage={page} navigate={navigate} authUser={authUser} />}
      <main id="main-content">
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "search" && <SearchResultsPage navigate={navigate} routeVersion={routeVersion} />}
        {page === "self-reporting" && <SelfReportingPage authUser={authUser} navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "privacy-policy" && <PrivacyPolicyPage />}
        {page === "terms-of-use" && <TermsOfUsePage />}
        {page === "contact" && <ContactPage />}
        {page === "get-care-now" && <GetCareNowPage navigate={navigate} />}
        {page === "find-a-dentist" && <FindADentistPage navigate={navigate} />}
        {page === "advertise-with-us" && <AdvertiseWithUsPage />}
        {page === "promote-your-practice" && <PromotePracticePage />}
        {page === "drugs-a-z" && <DrugsAZPage />}
        {page === "provider-login" && <ProviderLoginPage authUser={authUser} navigate={navigate} />}
        {page === "news" && <NewsPage />}
        {page === "help-center" && <HelpCenterPage />}
        {page === "blog" && <BlogPage />}
        {page === "sign-in" && <SignInPage authUser={authUser} navigate={navigate} />}
        {page === "account" && <AccountPage authUser={authUser} navigate={navigate} />}
        {page === "admin" && <AdminPage authUser={authUser} navigate={navigate} />}
        {page === "not-found" && <NotFoundPage navigate={navigate} />}
      </main>
      {!isAuthRoute && <Disclaimer />}
      {!isAuthRoute && <Footer navigate={navigate} />}
    </>
  );
}

function PageMeta({ page }: { page: Page }) {
  const title = `${routeTitles[page]} | DentaWorth`;
  const description =
    "DentaWorth provides Florida dental cash price range estimates by county for common dental procedures.";

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, [description, title]);

  return null;
}
