import { Link, useNavigate } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react'
import { useAuthStore } from '@/stores/authStore'

export function Navigation() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link to="/" className="font-bold text-inherit">
          Workshop Planner
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {user ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <Link to="/dashboard">Dashboard</Link>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Link to="/workshops">Workshops</Link>
            </NavbarItem>
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    className="transition-transform"
                    size="sm"
                    name={user.email?.[0].toUpperCase()}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/dashboard">
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="workshops" href="/workshops">
                    My Workshops
                  </DropdownItem>
                  <DropdownItem key="tools" href="/tools">
                    My Tools
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} to="/auth/login" variant="light">
                Sign In
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} to="/auth/signup" color="primary">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}
