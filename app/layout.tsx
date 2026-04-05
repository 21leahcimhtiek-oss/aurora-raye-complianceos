import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ComplianceOS — Enterprise Compliance Automation',
  description: 'Automate SOC 2, ISO 27001, HIPAA, and GDPR compliance with AI-powered evidence collection, control tracking, and audit management.',
  keywords: ['compliance', 'soc2', 'iso27001', 'hipaa', 'gdpr', 'compliance automation', 'saas'],
  authors: [{ name: 'Aurora Rayes LLC', url: 'https://auroramarket.org' }],
  openGraph: {
    title: 'ComplianceOS',
    description: 'Enterprise compliance automation platform',
    url: 'https://complianceos.vercel.app',
    siteName: 'ComplianceOS',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
