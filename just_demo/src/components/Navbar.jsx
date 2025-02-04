// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const Nav = styled.nav`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`

const Logo = styled(Link)`
  color: #FF1493;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">WeddingHub</Logo>
        <NavLinks>
          {user ? (
            <>
              <Link to="/upload">
                <Button variant="contained" sx={{ backgroundColor: '#FF1493' }}>
                  Upload
                </Button>
              </Link>
              <Button onClick={handleSignOut} sx={{ color: "#FF1493" }} >Sign Out</Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/login')} 
                sx={{ color: '#FF1493' }}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')} 
                variant="contained" 
                sx={{ backgroundColor: '#FF1493', color: 'white' }}
              >
                Register
              </Button>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  )
}

export default Navbar