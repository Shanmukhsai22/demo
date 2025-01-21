// src/components/Upload.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button, Paper, Typography, LinearProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabaseClient'
import toast from 'react-hot-toast'

// ... (previous styled components)

function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!video) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)
    try {
      const fileExt = video.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, video)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            title,
            description,
            video_url: filePath,
            user_id: user.id
          }
        ])

      if (dbError) throw dbError

      toast.success('Video uploaded successfully!')
      setTitle('')
      setDescription('')
      setVideo(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Upload Video
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          style={{ margin: '1rem 0' }}
        />
        {uploading && <LinearProgress />}
        <Button
          variant="contained"
          type="submit"
          disabled={uploading}
        >
          Upload Video
        </Button>
      </Form>
    </Container>
  )
}

export default Upload