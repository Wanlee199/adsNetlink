import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useNavigate, useRouterState,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary'
import { NotFound } from '../components/NotFound'
import appCss from '../styles/app.css?url'
import { seo } from '../utils/seo'
import { Toaster } from 'sonner'
import { useAtomValue } from 'jotai'
import { userAtom } from '../store/auth'
import { useLogout } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import MetadataBg from "../../public/metadata-bg.png"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'PTIT Cinema | Best Cinema Experience',
        description: `Book your tickets now!`,
        image: MetadataBg
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.png' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function Header() {
  const user = useAtomValue(userAtom)
  const logout = useLogout()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery } })
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-8 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent hidden sm:inline">
              PTIT Cinema
            </span>
        </Link>

        {/* Navigation - Left side */}
        <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 [&.active]:bg-red-100 dark:[&.active]:bg-red-900/30 [&.active]:text-red-600">
                Home
            </Link>
            {user && (
              <Link to="/my-tickets" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 [&.active]:bg-red-100 dark:[&.active]:bg-red-900/30 [&.active]:text-red-600">
                  My Tickets
              </Link>
            )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Bar - Desktop (Right side) */}
        <div className="hidden md:flex max-w-md w-full">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-9 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-red-600"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        {/* Right side - User/Auth */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()} className="hidden sm:inline-flex">
                Logout
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="sm:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" search={{ redirect: undefined }}>
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t p-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-red-600"
              autoFocus
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>
      )}
    </header>
  )
}
function HeaderManager() {
  const user = useAtomValue(userAtom)
  const logout = useLogout()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery } })
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-8 gap-4">
        {/* Logo */}
        <Link to="/manager" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent hidden sm:inline">
              PTIT Cinema
            </span>
        </Link>

        {/* Navigation - Left side */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/manager" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 [&.active]:bg-red-100 dark:[&.active]:bg-red-900/30 [&.active]:text-red-600">
            Movie Management
          </Link>
          {user && (
            <Link to="/room-manager" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 [&.active]:bg-red-100 dark:[&.active]:bg-red-900/30 [&.active]:text-red-600">
              Room Management
            </Link>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />
        {/* Right side - User/Auth */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()} className="hidden sm:inline-flex">
                Logout
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="sm:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" search={{ redirect: undefined }}>
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t p-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-red-600"
              autoFocus
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>
      )}
    </header>
  )
}


function Footer() {
  return (
    <footer className="border-t bg-muted py-12 text-muted-foreground">
<div className="flex float-right">
  <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">PTIT Cinema</h3>
      <p className="text-sm">
        The best cinema experience in town. Watch the latest blockbusters with premium quality.
      </p>
    </div>
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Movies</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/" hash="now-showing" className="hover:text-primary">Now Showing</Link></li>
        <li><Link to="/" hash="now-showing" className="hover:text-primary">Coming Soon</Link></li>
        <li><Link to="/" hash="now-showing" className="hover:text-primary">Top Rated</Link></li>
      </ul>
    </div>
  </div>
  <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-1 gap-4">
    <h3 className="text-lg font-bold text-foreground">Support</h3>
    <ul className="text-sm flex">
      <li><p className=" mr-4 hover:text-primary">Contact Us: </p></li>
      <li>
        <p> Nguyễn Thị Thu Hiên , Email: hienntt.k24dtcn191@stu.ptit.edu.vn</p>
        <p> Nguyễn Thu Hiền , Email: hiennt.k24dtcn193@stu.ptit.edu.vn</p>
        <p> Nguyễn Ngọc Mạnh , Email:manhnn.k24dtcn211@stu.ptit.edu.vn</p>
        <p> Hồ Hữu Phước , Email: phuochh.k24dtcn217@stu.ptit.edu.vn</p>
        <p> Nguyễn Đức Phương , Email: phuongnd.k24dtcn218@stu.ptit.edu.vn</p>
        <p> Lê Đức Minh Quân , Email: quanldm.k24dtcn220@stu.ptit.edu.vn</p>
      </li>
    </ul>
  </div>
</div>
      <div className="container px-4 md:px-8 mt-12 pt-8 border-t text-center text-sm">
        &copy; {new Date().getFullYear()} PTIT Cinema. All rights reserved.
      </div>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();

  const pathname = routerState.location.pathname;

  const isManager = pathname.startsWith('/manager') || pathname.startsWith('/room-manager');
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
      {isManager ? <HeaderManager /> : <Header />}
        <main className="flex-1">
            {children}
        </main>
      {!isManager && <Footer />}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
