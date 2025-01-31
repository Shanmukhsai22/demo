// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import toast from 'react-hot-toast';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('https://source.unsplash.com/random/1920x1080/?wedding');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  color: #FF1493;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,192,203,0.1) 0%, rgba(255,182,193,0.1) 100%);
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 20, 147, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 1rem 0;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(255,20,147,0.1);
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.$delay || '0s'};

  &:hover {
    transform: translateY(-5px);
  }

  .icon {
    color: #FF1493;
    font-size: 2rem;
    margin-right: 1rem;
  }

  .content {
    display: flex;
    align-items: center;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 10px;
      
      &:hover fieldset {
        border-color: #FF1493;
      }
      
      &.Mui-focused fieldset {
        border-color: #FF1493;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    background: linear-gradient(45deg, #FF1493, #FF69B4);
    color: white;
    padding: 12px;
    border-radius: 25px;
    font-size: 1rem;
    text-transform: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(45deg, #FF69B4, #FF1493);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 20, 147, 0.3);
    }

    &.Mui-disabled {
      background: #ccc;
      color: #666;
    }
  }
`;

const HeadingText = styled(Typography)`
  font-weight: 700;
  background: linear-gradient(45deg, #FF1493, #FF69B4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  line-height: 1.2;
  animation: ${fadeIn} 1s ease-out;
`;

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      toast.success('Welcome back to WeddingVibe!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LeftPanel>
        <HeadingText variant="h3">
          Share Your Wedding Magic
        </HeadingText>

        <FeatureCard $delay="0s">
          <div className="content">
            <VideoCameraBackIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Share Your Stories
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Upload and showcase your best wedding moments
              </Typography>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard $delay="0.2s">
          <div className="content">
            <MonetizationOnIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Earn While Creating
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Get paid for your beautiful wedding content
              </Typography>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard $delay="0.4s">
          <div className="content">
            <CelebrationIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Join Our Community
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Connect with wedding creators worldwide
              </Typography>
            </div>
          </div>
        </FeatureCard>
      </LeftPanel>

      <RightPanel>
        <Form onSubmit={handleSubmit}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#FF1493', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF1493' }}>
              Welcome Back
            </Typography>
          </Box>

          <StyledTextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
          />

          <StyledTextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <StyledButton 
            type="submit" 
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </StyledButton>

          <Button
            variant="text"
            onClick={() => navigate('/register')}
            disabled={loading}
            sx={{ 
              color: '#FF1493',
              '&:hover': {
                background: 'rgba(255,20,147,0.1)'
              }
            }}
          >
            New to WeddingVibe? Join Now
          </Button>
        </Form>
      </RightPanel>
    </PageContainer>
  );
}

export default Login;