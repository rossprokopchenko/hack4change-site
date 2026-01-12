import ResponsiveAppBar from "@/components/app-bar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Box from "@mui/material/Box";
import AuthProvider from "@/services/auth/auth-provider";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { dir } from "i18next";
import "@/services/i18n/config";
import type { Metadata } from "next";
import ToastContainer from "@/components/snackbar-provider";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import ThemeProvider from "@/components/theme/theme-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import queryClient from "@/services/react-query/query-client";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
import EventJsonLd from "@/components/seo/json-ld";
import { seoConfig } from "@/config/seo.config";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "common");
  const { baseUrl, defaultOgImage, siteName } = seoConfig;

  const title = "Hack4Change Moncton";
  const description = t("seo.description");

  return {
    title: {
      default: title,
      template: `${title} - %s`,
    },
    description,
    keywords: t("seo.keywords"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName,
      locale: language === "fr" ? "fr_CA" : "en_CA",
      type: "website",
      images: [
        {
          url: defaultOgImage,
          width: 1042,
          height: 521,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
    icons: {
      icon: "/icon.png",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
}) {
  const { children } = props;
  const language = await getServerLanguage();

  // Get SEO description for JSON-LD structured data
  const { t } = await getServerTranslation(language, "common");
  const seoDescription = t("seo.description");

  return (
    <html lang={language} dir={dir(language)} suppressHydrationWarning>
      <head>
        <EventJsonLd language={language} description={seoDescription} />
      </head>
      <body suppressHydrationWarning>
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <CssBaseline />

            <StoreLanguageProvider>
              <ConfirmDialogProvider>
                <AuthProvider>
                  <GoogleAuthProvider>
                    <FacebookAuthProvider>
                      <LeavePageProvider>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                          }}
                        >
                          <ResponsiveAppBar />
                          <Box
                            component="main"
                            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                          >
                            {children}
                          </Box>
                          <Footer />
                          <ScrollToTop />
                        </Box>
                        <ToastContainer
                          position="bottom-left"
                          hideProgressBar
                        />
                      </LeavePageProvider>
                    </FacebookAuthProvider>
                  </GoogleAuthProvider>
                </AuthProvider>
              </ConfirmDialogProvider>
            </StoreLanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

