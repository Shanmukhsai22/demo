import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
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

  @media (max-width: 968px) {
    padding: 3rem 1rem;
  }
`;

const RightPanel = styled.div`
  flex: 1.2;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow-y: auto;
`;

const HeadingText = styled(Typography)`
  font-weight: 700;
  background: linear-gradient(45deg, #FF1493, #FF69B4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 3rem;
  line-height: 1.2;
  animation: ${fadeIn} 1s ease-out;
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
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

const StyledFormControl = styled(FormControl)`
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

const steps = ['Account Details', 'Personal Information'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 1) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }

      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    try {
      await signUp(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );

      case 1:
        return (
          <>
            <StyledTextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
              fullWidth
            />

            <StyledTextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              fullWidth
              inputProps={{
                maxLength: 10
              }}
            />

            <StyledTextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <StyledFormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.gender && (
                <Typography color="error" variant="caption" sx={{ ml: 2, mt: 0.5 }}>
                  {errors.gender}
                </Typography>
              )}
            </StyledFormControl>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <LeftPanel>
        <HeadingText variant="h3">
          Join WeddingVibe
        </HeadingText>

        <FeatureCard $delay="0s">
          <div className="content">
            <VideoCameraBackIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Share Your Moments
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Create and share beautiful wedding memories
              </Typography>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard $delay="0.2s">
          <div className="content">
            <MonetizationOnIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Connect with Others
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Join our community of wedding enthusiasts
              </Typography>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard $delay="0.4s">
          <div className="content">
            <CelebrationIcon className="icon" />
            <div>
              <Typography variant="h6" sx={{ color: '#FF1493', fontWeight: 600 }}>
                Celebrate Love
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Be part of beautiful wedding celebrations
              </Typography>
            </div>
          </div>
        </FeatureCard>
      </LeftPanel>

      <RightPanel>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#FF1493', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF1493' }}>
              Create Account
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ color: '#FF1493' }}
              >
                Back
              </Button>
              <StyledButton 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {activeStep === steps.length - 1 ? 'Creating Account...' : 'Next...'}
                  </>
                ) : (
                  activeStep === steps.length - 1 ? 'Create Account' : 'Next'
                )}
              </StyledButton>
            </Box>
          </Form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              disabled={loading}
              sx={{ 
                color: '#FF1493',
                '&:hover': {
                  background: 'rgba(255,20,147,0.1)'
                }
              }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </RightPanel>
    </PageContainer>
  );
};

export default Register;