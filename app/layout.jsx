import "./globals.css";

export const metadata = {
  title: "DocuMentor AI",
  description: "Classroom document sharing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
