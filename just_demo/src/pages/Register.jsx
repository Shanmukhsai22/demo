// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import { TextField, Button, Paper, Typography } from '@mui/material'
import toast from 'react-hot-toast'

const Container = styled(Paper)`
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      toast.success('Registration successful! Please check your email.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Container elevation={3}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" type="submit">
          Register
        </Button>
        <Button variant="text" onClick={() => navigate('/login')}>
          Already have an account? Login
        </Button>
      </Form>
    </Container>
  )
}

export default Register