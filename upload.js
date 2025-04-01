const axios = require('axios');

// API keys from GitHub Secrets
const PIXELDRAIN_API = process.env.PIXELDRAIN_API;
const MIXDROP_API = process.env.MIXDROP_API;
const STREAMTAPE_API = process.env.STREAMTAPE_API;
const EARNVIDS_API = process.env.EARNVIDS_API;

async function uploadToPixelDrain(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pixeldrain.com/v1/upload', formData, {
      headers: {
        'Authorization': `Bearer ${PIXELDRAIN_API}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded to PixelDrain:', response.data);
    return response.data.url;
  } catch (error) {
    console.error('Error uploading to PixelDrain:', error);
  }
}

async function uploadToMixDrop(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.mixdrop.app/upload', formData, {
      headers: {
        'Authorization': `Bearer ${MIXDROP_API}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded to MixDrop:', response.data);
    return response.data.url;
  } catch (error) {
    console.error('Error uploading to MixDrop:', error);
  }
}

async function uploadToStreamTape(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.streamtape.com/file/upload', formData, {
      headers: {
        'Authorization': `Bearer ${STREAMTAPE_API}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded to StreamTape:', response.data);
    return response.data.url;
  } catch (error) {
    console.error('Error uploading to StreamTape:', error);
  }
}

async function uploadToEarnVids(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.earnvids.com/upload', formData, {
      headers: {
        'Authorization': `Bearer ${EARNVIDS_API}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded to EarnVids:', response.data);
    return response.data.url;
  } catch (error) {
    console.error('Error uploading to EarnVids:', error);
  }
}

async function uploadMovie(file) {
  try {
    const pixelDrainUrl = await uploadToPixelDrain(file);
    const mixDropUrl = await uploadToMixDrop(file);
    const streamTapeUrl = await uploadToStreamTape(file);
    const earnVidsUrl = await uploadToEarnVids(file);

    console.log('Movie uploaded to all platforms!');
    return {
      pixelDrain: pixelDrainUrl,
      mixDrop: mixDropUrl,
      streamTape: streamTapeUrl,
      earnVids: earnVidsUrl,
    };
  } catch (error) {
    console.error('Error uploading movie:', error);
  }
}

module.exports = {
  uploadMovie,
};
