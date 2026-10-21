import "./globals.css";

export const metadata = {
  title: "RVU Contributors Wall · Hacktoberfest 2026",
  description:
    "Every card on this wall is a merged pull request from the DevSphere x FOSS RVU Hacktoberfest 2026 meetup at RV University.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
