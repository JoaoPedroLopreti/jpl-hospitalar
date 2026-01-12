import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: any) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Rotas protegidas
    const protectedRoutes = ['/dashboard', '/propostas', '/admin']
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Redirecionar para login se não autenticado
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar role para admin
    if (request.nextUrl.pathname.startsWith('/admin') && user) {
        const { data: userData } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Verificar role para technician
    if (request.nextUrl.pathname.startsWith('/dashboard/technician') && user) {
        const { data: userData } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'TECHNICIAN' && userData?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Verificar role para company
    if (request.nextUrl.pathname.startsWith('/dashboard/company') && user) {
        const { data: userData } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'COMPANY' && userData?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Redirecionar para dashboard se logado e tentar acessar login
    if (request.nextUrl.pathname === '/login' && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
