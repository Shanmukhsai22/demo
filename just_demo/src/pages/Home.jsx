// src/pages/Home.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, IconButton, AppBar, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

const theme = {
  primary: '#FF1493',
  secondary: '#FFC0CB',
  background: '#FFFFFF',
  text: '#4A4A4A',
  white: '#FFFFFF',
  gold: '#D4AF37',
  rose: '#FFE4E1',
  gray: '#F5F5F5'
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Playfair Display', serif;
  background: ${theme.background};
`;

const TopNav = styled(AppBar)`
  && {
    background: ${theme.white};
    color: ${theme.text};
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.primary};
  margin-left: 20px;
  font-family: 'Playfair Display', serif;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 30px;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 40px;
    border: 1px solid ${theme.gray};
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: ${theme.primary};
      box-shadow: 0 0 0 2px ${theme.primary}20;
    }
  }
`;

const SideNav = styled.div`
  width: ${props => props.isOpen ? '250px' : '70px'};
  background: ${theme.white};
  height: 100vh;
  position: fixed;
  padding-top: 70px;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  z-index: 100;
`;

const MainContent = styled.div`
  margin-left: ${props => props.isOpen ? '250px' : '70px'};
  padding: 90px 30px 30px;
  width: 100%;
  transition: all 0.3s ease;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: ${theme.text};
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 5px 10px;
  border-radius: 10px;
  
  &:hover {
    background: ${theme.primary}15;
    color: ${theme.primary};
  }
  
  span {
    margin-left: 15px;
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s;
    font-weight: 500;
  }
`;

const HeroSection = styled.div`
  position: relative;
  background: ${theme.white};
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,20,147,0.1), transparent);
  }
`;

const HeroContent = styled.div`
  display: flex;
  padding: 60px;
  gap: 40px;
  align-items: center;
`;

const HeroInfo = styled.div`
  flex: 1;
  z-index: 1;
`;

const HeroImage = styled.img`
  flex: 1;
  max-width: 500px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const HeroTitle = styled.h1`
  color: ${theme.primary};
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
`;

const HeroText = styled.p`
  color: ${theme.text};
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0;
`;

// Continued in Part 2...
// Continuing from Part 1...

const CategoryCard = styled.div`
  background: ${theme.white};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.5s ease;
`;

const CategoryContent = styled.div`
  padding: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: ${theme.gray};
  }
`;

const CategoryTitle = styled.h3`
  margin: 0 0 10px;
  color: ${theme.text};
  font-size: 1.2rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  color: ${theme.text}99;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.6;
`;

const StyledButton = styled(Button)`
  && {
    background: ${theme.primary};
    color: ${theme.white};
    padding: 12px 30px;
    border-radius: 25px;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 0 5px 15px ${theme.primary}40;
    
    &:hover {
      background: ${theme.primary};
      box-shadow: 0 8px 20px ${theme.primary}60;
      transform: translateY(-2px);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

function Home() {
  const [isOpen, setIsOpen] = useState(true);
  
  const categories = [
    {
      title: 'Family Wedding',
      image: 'https://shaadiwish.com/blog/wp-content/uploads/2020/05/family-portrait.jpg',
      description: 'Intimate celebrations that bring families together in joy and tradition.'
    },
    {
      title: 'Theme Wedding',
      image: 'https://www.jaypeehotels.com/blog/wp-content/uploads/2021/01/Wedding-Themes-1024x684.jpg',
      description: 'Unique and personalized ceremonies that tell your story.'
    },
    {
      title: 'Destination Wedding',
      image: 'https://luxaus.au/wp-content/uploads/2023/03/kerala-1024x683.jpeg',
      description: 'Magical moments in breathtaking locations around the world.'
    },
    {
      title: 'Budget Wedding',
      image: 'https://image.wedmegood.com/resized-nw/800X400/wp-content/uploads/2023/09/390691097_359060009882771_7765747183872332460_n.jpg',
      description: 'Beautiful ceremonies that dont break the bank.'
    },
    {
      title: 'Modern Wedding',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSugX7lGQfLlYSQP5t3iA_e4X-IdZM5qmNcsg&s',
      description: 'Contemporary celebrations with cutting-edge style.'
    },
    {
      title: 'Beach Wedding',
      image: 'https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/001/704/252/new_large/89392251_2497068247064069_7095273921600937248_n.jpg?1587373853',
      description: 'Romantic ceremonies with ocean views and sandy shores.'
    }
  ];

  return (
    <>
      <TopNav position="fixed">
        <Toolbar>
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            <MenuIcon />
          </IconButton>
          <Logo>WeddingHub</Logo>
          <SearchBar>
            <SearchIcon sx={{ position: 'absolute', left: 12, top: 12, color: '#666' }} />
            <input placeholder="Search for wedding videos..." />
          </SearchBar>
          <IconButton>
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </TopNav>

      <PageContainer>
        <SideNav isOpen={isOpen}>
          <NavItem to="/" isOpen={isOpen}>
            <HomeIcon />
            <span>Home</span>
          </NavItem>
          <NavItem to="/videos" isOpen={isOpen}>
            <VideoLibraryIcon />
            <span>Wedding Videos</span>
          </NavItem>
          <NavItem to="/favorites" isOpen={isOpen}>
            <FavoriteIcon />
            <span>Favorites</span>
          </NavItem>
        </SideNav>

        <MainContent isOpen={isOpen}>
          <HeroSection>
            <HeroContent>
              <HeroInfo>
                <HeroTitle>
                  Discover Your Dream Wedding
                  <FavoriteIcon sx={{ fontSize: '1rem', marginLeft: '10px', color: theme.primary }} />
                </HeroTitle>
                <HeroText>
                  Explore our collection of beautiful wedding videos and find inspiration
                  for your perfect day. From intimate ceremonies to grand celebrations,
                  we have everything you need to make your wedding memorable.
                </HeroText>
                <ActionButtons>
                  <StyledButton variant="contained">
                    Browse Collections
                  </StyledButton>
                  <StyledButton variant="outlined" sx={{ 
                    borderColor: theme.primary, 
                    color: theme.primary,
                    '&:hover': { borderColor: theme.primary }
                  }}>
                    Contact Vendors
                  </StyledButton>
                </ActionButtons>
              </HeroInfo>
              <HeroImage src="https://weddingdocumentary.com/wp-content/uploads/2023/06/Seerat_Vikas_Reception-167-1536x1024.jpg" 
                        alt="Wedding Celebration" />
            </HeroContent>
          </HeroSection>

          <CategoryGrid>
            {categories.map((category, index) => (
              <CategoryCard key={index}>
                <CategoryImage src={category.image} alt={category.title} />
                <CategoryContent>
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryDescription>{category.description}</CategoryDescription>
                </CategoryContent>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </MainContent>
      </PageContainer>
    </>
  );
}

export default Home;