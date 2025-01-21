// src/pages/Home.jsx
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`

function Home() {
  return (
    <Container>
      <Title>Welcome to WeddingHub</Title>
      <p>Start exploring videos or upload your own!</p>
    </Container>
  )
}

export default Home