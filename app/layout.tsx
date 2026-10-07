export const metadata = {
  title: "MoneyFlow",
  description: "Personal money tracker with Supabase and LINE bot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
