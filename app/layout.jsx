import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Synthiq — Web Design for Local Businesses',
  description: 'We build free demo sites for local businesses in Augusta, GA.',
  metadataBase: new URL('https://synthiqdesigns.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#F7F7F4' }}>
        {children}
      </body>
    </html>
  )
}
