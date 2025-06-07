// require('dotenv').config(); 
const spotifyPreviewFinder = require('spotify-preview-finder');
process.env.SPOTIFY_CLIENT_ID = 'b8af7746908b4decaf0307acb6bf1782';
process.env.SPOTIFY_CLIENT_SECRET = '503ea76d56af4a549722473b8b4c5331';

export default async function getSong(name) {
  

  try {
    const result = await spotifyPreviewFinder(name, 1);
    if (result.success) {
      console.log("succes")
    } else {
      console.log("errror")
    }
    return result
  } catch (err) {
    console.log("error")
  }
}
