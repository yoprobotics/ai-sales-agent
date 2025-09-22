// This file is deprecated and replaced by individual page routes
// Keeping for backwards compatibility during transition
import { redirect } from 'next/navigation'

const redirectMap: Record<string, string> = {
  privacy: '/legal/privacy',
  terms: '/legal/terms',
  contact: '/legal/contact',
  disclaimer: '/legal/disclaimer',
  disclosure: '/legal/disclosure',
  cookies: '/legal/cookies',
  dpa: '/legal/dpa',
  subprocessors: '/legal/subprocessors',
}

export default function LegacyLegalDocPage({
  params
}: {
  params: { doc: string }
}) {
  const redirectTo = redirectMap[params.doc]
  if (redirectTo) {
    redirect(redirectTo)
  }
  
  // If no redirect found, go to main legal page
  redirect('/legal')
}