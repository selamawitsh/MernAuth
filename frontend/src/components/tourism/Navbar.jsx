import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, User, LogOut, ChevronDown, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const navItems = ['Destinations', 'Packages', 'Why Us', 'Testimonials', 'Contact'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <Plane className="w-8 h-8 text-green-600 relative z-10" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
                Ethiopia Escape
              </span>
              <p className="text-xs text-gray-500">Discover Wonder</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative text-gray-700 hover:text-green-600 transition-colors group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}

            {/* User Profile Section */}
            {user && (
              <div className="relative profile-menu">
                <motion.button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                    <AvatarFallback className="text-xs bg-gradient-to-br from-green-500 to-yellow-400 text-white">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-yellow-400 text-white">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Account Info</p>
                        </div>

                        <div className="px-3 py-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Username:</span>
                            <span className="font-medium">@{user.username}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{user.email}</span>
                          </div>

                          {user.provider === 'google' && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-4 h-4 flex items-center justify-center text-orange-500 font-bold text-xs">G</div>
                              <span className="text-gray-600">Provider:</span>
                              <span className="font-medium">Google</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium text-green-600">Verified</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              navigate('/welcome');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            View Full Profile
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookingModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-yellow-400 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Book Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t mt-4"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {/* User Profile in Mobile Menu */}
              {user && (
                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-yellow-400 text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>

                    {user.provider === 'google' && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center text-orange-500 font-bold text-xs">G</div>
                        <span className="text-gray-600">Google Account</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`}
                  className="text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

              {/* Mobile Menu Actions */}
              <div className="border-t pt-4 mt-2 space-y-2">
                {user && (
                  <>
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/welcome');
                      }}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-400 text-white"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        user={user}
      />
    </motion.nav>
  );
};

export default Navbar;