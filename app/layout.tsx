import "../styles/globals.css";
import { Provider } from "./context";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { initDb } from "../lib/dbInit";

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  // Initialize DB on app start (server-side)
  await initDb();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TRX Headphones</title>
        <meta name="description" content="The Best Headphone" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
