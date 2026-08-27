import './globals.css';
import { Providers } from '../components/Providers';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'CodeVerix AI - AI-Powered Code Repair and Verification Platform',
  description: 'Analyze bugs, generate intelligent fixes, and understand your code with AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
