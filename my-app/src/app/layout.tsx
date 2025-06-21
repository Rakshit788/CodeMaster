import "./globals.css";
import ClientLayout from "../../ClientLayout";

export const metadata = {
  title: "CodeMaster",
  description: "LeetCode-style coding interface for practicing problems and competing in contests.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 dark:bg-[#0d1117] text-black dark:text-white min-h-screen flex flex-col font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
