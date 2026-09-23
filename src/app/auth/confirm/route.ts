import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      requestUrl.pathname = '/dashboard'
      requestUrl.search = ''
      return NextResponse.redirect(requestUrl)
    }
  }

  requestUrl.pathname = '/login'
  requestUrl.search = ''
  return NextResponse.redirect(requestUrl)
}
