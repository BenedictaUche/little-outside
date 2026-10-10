import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const APP_NAME = "Little Outside";
const APP_DESCRIPTION =
  "Small outdoor adventures and new words discovered along the way.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF7ED",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-h-screen flex-col font-sans text-[14px] leading-relaxed text-plum">
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
