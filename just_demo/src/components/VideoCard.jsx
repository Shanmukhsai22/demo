// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardMedia, CardContent, Typography, Avatar } from '@mui/material';

const StyledCard = styled(Card)`
  width: 320px;
  margin: 10px;
  box-shadow: none;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const VideoInfo = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <CardMedia
          component="img"
          height="180"
          image={video.thumbnail_url}
          alt={video.title}
        />
        <CardContent>
          <VideoInfo>
            <Avatar src={video.user.avatar_url} />
            <div>
              <Typography variant="subtitle1" fontWeight="bold">
                {video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.views} views • {video.created_at}
              </Typography>
            </div>
          </VideoInfo>
        </CardContent>
      </StyledCard>
    </Link>
  );
};

export default VideoCard