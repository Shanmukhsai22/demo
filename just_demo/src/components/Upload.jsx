// src/components/Upload.jsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Grid,
  Box,
  MenuItem,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload,
  AddPhotoAlternate,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import toast from 'react-hot-toast';

// Constants
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 500MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Styled Components
const Container = styled(Paper)`
  max-width: 1200px;
  margin: 40px auto;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UploadBox = styled(Box)`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1976d2;
    background: rgba(25, 118, 210, 0.04);
  }
`;

const PreviewImage = styled.img`
  max-width: 300px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin: 16px 0;
`;

const VideoPreview = styled.video`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin: 16px 0;
`;

const ProgressContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const ProgressText = styled.div`
  margin-top: 8px;
  color: #666;
`;

const steps = ['Upload Media', 'Basic Information', 'Wedding Details', 'Additional Information'];

const weddingtypes = [
  'Traditional',
  'Modern',
  'Destination',
  'Beach',
  'Garden',
  'Religious',
  'Cultural',
  'Intimate',
  'Luxury',
  'Themed',
];

function Upload() {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weddingtype: '',
    tags: [],
    duration: '',
    location: '',
    eventdate: '',
    couplename: '',
    venue: '',
    guestcount: null,
    photographer: '',
    cinematographer: '',
    equipment: '',
    resolution: '',
    price: '',
    ceremonytype: '',
    receptiondetails: '',
    specialmoments: '',
    musicdetails: '',
    ispublic: true,
    allow_comments: true,
    allow_downloads: false,
  });

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const validateFile = (file, type = 'video') => {
    if (!file) return 'No file selected';
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 500MB limit';
    }

    const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'guestcount') {
      const numberValue = value === '' ? null : parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
      return;
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleVideoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'video');
      if (error) {
        toast.error(error);
        return;
      }

      setVideo(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        setFormData(prev => ({
          ...prev,
          duration: Math.round(video.duration)
        }));
      }
      video.src = URL.createObjectURL(file);
    }
  }, []);

  const handleThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'image');
      if (error) {
        toast.error(error);
        return;
      }
      setThumbnail(file);
    }
  }, []);

  const handleAddTag = useCallback((e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!video) return 'Please upload a video';
        if (!thumbnail) return 'Please upload a thumbnail';
        break;
      case 1:
        if (!formData.title.trim()) return 'Title is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.weddingtype) return 'Please select a wedding type';
        break;
      case 2:
        if (!formData.couplename.trim()) return 'Couple names are required';
        if (!formData.eventdate) return 'Event date is required';
        if (!formData.location.trim()) return 'Location is required';
        break;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(activeStep);
    if (error) {
      toast.error(error);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || !thumbnail) {
      toast.error('Please select both video and thumbnail');
      return;
    }

    setUploading(true);
    try {
      // Upload video
      const videoExt = video.name.split('.').pop();
      const videoName = `${Date.now()}_video.${videoExt}`;
      const videoPath = `${user.id}/${videoName}`;

      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoPath, video, {
          onProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(percentage);
          }
        });

      if (videoError) throw videoError;

      // Upload thumbnail
      const thumbExt = thumbnail.name.split('.').pop();
      const thumbName = `${Date.now()}_thumb.${thumbExt}`;
      const thumbPath = `${user.id}/${thumbName}`;

      const { error: thumbError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, thumbnail);

      if (thumbError) throw thumbError;

      // Save to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([{
          ...formData,
          video_url: videoPath,
          thumbnail_url: thumbPath,
          user_id: user.id
        }]);

      if (dbError) throw dbError;

      toast.success('Video uploaded successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        weddingtype: '',
        tags: [],
        duration: '',
        location: '',
        eventdate: '',
        couplename: '',
        venue: '',
        guestcount: null,
        photographer: '',
        cinematographer: '',
        equipment: '',
        resolution: '',
        price: null,
        ceremonytype: '',
        receptiondetails: '',
        specialmoments: '',
        musicdetails: '',
        ispublic: true,
        allow_comments: true,
        allow_downloads: false,
      });
      setVideo(null);
      setThumbnail(null);
      setActiveStep(0);
      setUploadProgress(0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <UploadBox>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  style={{ display: 'none' }}
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button
                    component="span"
                    startIcon={<CloudUpload />}
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    Upload Video
                  </Button>
                </label>
                {video && (
                  <VideoPreview controls>
                    <source src={URL.createObjectURL(video)} type={video.type} />
                  </VideoPreview>
                )}
              </UploadBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <UploadBox>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload">
                  <Button
                    component="span"
                    startIcon={<AddPhotoAlternate />}
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    Upload Thumbnail
                  </Button>
                </label>
                {thumbnail && (
                  <PreviewImage
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail preview"
                  />
                )}
              </UploadBox>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Wedding Type"
                name="weddingtype"
                value={formData.weddingtype}
                onChange={handleChange}
                required
              >
                {weddingtypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                helperText="Press Enter to add tags"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Couple Names"
                name="couplename"
                value={formData.couplename}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                name="eventdate"
                value={formData.eventdate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Guest Count"
                name="guestcount"
                type="number"
                value={formData.guestcount ?? ''}
                onChange={handleChange}
                inputProps={{ 
                min: 0,
                step: 1
                }}
            />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ceremony Type"
                name="ceremonytype"
                value={formData.ceremonytype}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Photographer"
                name="photographer"
                value={formData.photographer}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cinematographer"
                name="cinematographer"
                value={formData.cinematographer}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Equipment Used"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Resolution"
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
              >
                <MenuItem value="1080p">1080p</MenuItem>
                <MenuItem value="2k">2K</MenuItem>
                <MenuItem value="4k">4K</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price === null ? '' : formData.price}
                onChange={handleChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ 
                min: 0,
                step: 0.01  // Allow decimal places for price
                }}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Moments/Highlights"
                name="specialMoments"
                value={formData.specialmoments}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Music Details"
                name="musicDetails"
                value={formData.musicdetails}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ispublic}
                    onChange={handleChange}
                    name="ispublic"
                  />
                }
                label="Make video public"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Upload Wedding Video
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}
        
        {uploading && (
          <ProgressContainer>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <ProgressText>{Math.round(uploadProgress)}% uploaded</ProgressText>
          </ProgressContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBefore />}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={uploading}
              startIcon={<CloudUpload />}
            >
              Upload
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          )}
        </Box>
      </Form>
    </Container>
  );
}

export default Upload;