import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <ScrollToTop />
      <Footer />

    </>
  )
}
