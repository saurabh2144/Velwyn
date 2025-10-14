import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className='container flex-grow'>
      <ThemeProvider>
        {children}
        </ThemeProvider>
        </main>;
}
