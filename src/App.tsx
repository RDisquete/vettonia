import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import Toaster from './components/Toaster'
import ReminderManager from './components/ReminderManager'

import Home from './pages/Home'

const Lineup = lazy(() => import('./pages/Lineup'))
const Artists = lazy(() => import('./pages/Artists'))
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Info = lazy(() => import('./pages/Info'))
const Access = lazy(() => import('./pages/Access'))
const Upload = lazy(() => import('./pages/Upload'))
const Contact = lazy(() => import('./pages/Contact'))
const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const LineupManage = lazy(() => import('./pages/admin/LineupManage'))
const GalleryManage = lazy(() => import('./pages/admin/GalleryManage'))
const Alerts = lazy(() => import('./pages/admin/Alerts'))
const ContentManage = lazy(() => import('./pages/admin/ContentManage'))

function PageLoader() {
  return (
    <div className="min-h-svh bg-arena flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-violeta/30 border-t-coral rounded-full animate-spin" />
        <span className="font-mono text-black/40 text-[8px] tracking-[0.4em] uppercase animate-pulse">Cargando...</span>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:bg-carbón focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-[10px] focus:tracking-[0.3em] focus:uppercase focus:outline-none">
        Saltar al contenido principal
      </a>
      <PageTransition><main id="main-content">{children}</main></PageTransition>
    </>
  )
}

function App() {
  const location = useLocation()
  return (
    <>
      <Toaster />
      <ReminderManager />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
          <Route path="/" element={<PageWrap key={location.pathname}><Home /></PageWrap>} />
          <Route path="/lineup" element={<PageWrap key={location.pathname}><Lineup /></PageWrap>} />
          <Route path="/artists" element={<PageWrap key={location.pathname}><Artists /></PageWrap>} />
          <Route path="/artists/:slug" element={<PageWrap key={location.pathname}><ArtistDetail /></PageWrap>} />
          <Route path="/map" element={<PageWrap key={location.pathname}><MapPage /></PageWrap>} />
          <Route path="/gallery" element={<PageWrap key={location.pathname}><Gallery /></PageWrap>} />
          <Route path="/info" element={<PageWrap key={location.pathname}><Info /></PageWrap>} />
          <Route path="/access" element={<PageWrap key={location.pathname}><Access /></PageWrap>} />
          <Route path="/upload" element={<PageWrap key={location.pathname}><Upload /></PageWrap>} />
          <Route path="/register" element={<PageWrap key={location.pathname}><Register /></PageWrap>} />
          <Route path="/login" element={<PageWrap key={location.pathname}><Login /></PageWrap>} />
          <Route path="/contact" element={<PageWrap key={location.pathname}><Contact /></PageWrap>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="lineup" element={<LineupManage />} />
            <Route path="gallery" element={<GalleryManage />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="content" element={<ContentManage />} />
          </Route>
          <Route path="*" element={<PageWrap key={location.pathname}><NotFound /></PageWrap>} />
        </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App
