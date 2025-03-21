import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Trophy, 
  Users, 
  User, 
  BarChart3, 
  LogIn, 
  Menu, 
  X,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200",
          isActive 
            ? "bg-quiz-primary text-white" 
            : "text-quiz-text hover:bg-quiz-accent/20"
        )}
        onClick={closeMenu}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container flex justify-between items-center h-16 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="text-2xl font-bold text-gradient">Quiz Master</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" icon={<Home size={18} />} label="Home" />
          <NavLink to="/solo" icon={<User size={18} />} label="Solo" />
          <NavLink to="/duo" icon={<Users size={18} />} label="Duo" />
          <NavLink to="/tournament" icon={<Trophy size={18} />} label="Tournament" />
          <NavLink to="/stats" icon={<BarChart3 size={18} />} label="Statistics" />
        </div>
        
        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="font-medium">
                  <UserCircle className="mr-2 h-4 w-4" />
                  {user?.username || 'Profile'}
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="font-medium bg-quiz-primary hover:bg-quiz-secondary"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="font-medium">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-medium bg-quiz-primary hover:bg-quiz-secondary">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 animate-fade-in md:hidden">
          <div className="container px-4 mx-auto space-y-4 pt-4">
            <NavLink to="/" icon={<Home size={18} />} label="Home" />
            <NavLink to="/solo" icon={<User size={18} />} label="Solo" />
            <NavLink to="/duo" icon={<Users size={18} />} label="Duo" />
            <NavLink to="/tournament" icon={<Trophy size={18} />} label="Tournament" />
            <NavLink to="/stats" icon={<BarChart3 size={18} />} label="Statistics" />
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="outline" className="w-full font-medium">
                      <UserCircle className="mr-2 h-4 w-4" />
                      {user?.username || 'Profile'}
                    </Button>
                  </Link>
                  <Button 
                    className="w-full font-medium bg-quiz-primary hover:bg-quiz-secondary"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full font-medium">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full font-medium bg-quiz-primary hover:bg-quiz-secondary">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;