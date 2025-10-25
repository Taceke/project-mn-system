import "./globals.css";
import { Providers } from "./providers";
import  Navbar  from "./components/Navbar"; // ✅ simplified import

export const metadata = {
  title: "Project Management App",
  description: "Next.js project with NextAuth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // ✅ add typing for props
}) {
  return (
    <html lang="en">
      <body className="bg-amber-500">
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
