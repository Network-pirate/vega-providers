export const stream = async (id: string) => {
  // The 'id' passed here is the URL we extracted from posts.ts
  const postUrl = id;

  try {
    const response = await fetch(postUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return { streams: [] };
    }

    const html = await response.text();

    // Extract links found inside the post page (such as G-Direct, hubcloud, or download buttons)
    const linkMatches = html.matchAll(/href="(https:\/\/[^"]+)"/g);
    const streams: any[] = [];

    const seenUrls = new Set();
    for (const match of linkMatches) {
      const link = match[1];
      // Filter for typical download/stream domains or direct file extensions
      if (
        link && 
        !seenUrls.has(link) && 
        (link.includes("pixl") || link.includes("filepress") || link.includes("hubcloud") || link.includes("gdirect") || link.endsWith(".mkv") || link.endsWith(".mp4"))
      ) {
        seenUrls.add(link);
        streams.push({
          title: "Download Link / Mirror",
          url: link,
        });
      }
    }

    return { streams };
  } catch (error) {
    console.error("Error fetching streams:", error);
    return { streams: [] };
  }
};