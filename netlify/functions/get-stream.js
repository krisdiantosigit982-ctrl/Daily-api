exports.handler = async function (event, context) {
  const videoId = event.queryStringParameters.id || 'xbgn3ny';

  try {
    const response = await fetch(`https://www.dailymotion.com/embed/video/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    const match = html.match(/https:\\\/\\\/cdndirector\.dailymotion\.com\\\/cdn\\\/manifest\\\/video\\\/[^\"]+\.m3u8\?sec=[^\"]+/);

    if (match) {
      const streamUrl = match[0].replace(/\\/g, '');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ status: 'success', video_id: videoId, stream_url: streamUrl })
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Token tidak ditemukan' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
