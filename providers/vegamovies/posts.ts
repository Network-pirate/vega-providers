export const posts = async (query: string, page: number) => {
  const baseUrl = "https://vegamovies15.co.in";
  const searchUrl = query 
    ? `${baseUrl}/page/${page}/?s=${encodeURIComponent(query)}` 
    : `${baseUrl}/page/${page}/`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    if (!response.ok) {
      return { items: [], hasNextPage: false };
    }

    const html = await response.text();
    
    // Simple regex-based parsing to extract movie titles, links, and posters from the HTML cards
    // This looks for article/post links and images typical of movie blog layouts
    const items: any[] = [];
    const postRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<img[^>]+src="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    
    // We can also match heading titles inside posts
    const titleRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;

    // For a cleaner approach, let's capture basic link and title blocks:
    const cardRegex = /<div class="card[^"]*">([\s\S]*?)<\/div>/g;
    
    // Let's implement a robust item collector
    // Since movie sites use standard anchor tags with post links, let's match hrefs containing the domain paths:
    const linkMatches = html.matchAll(/<a href="(https:\/\/vegamovies[^\"]+)"[^>]*>/g);
    
    const seenUrls = new Set();
    for (const match of linkMatches) {
      const url = match[1];
      if (url && !seenUrls.has(url) && (url.includes("/archives/") || url.length > 30)) {
        seenUrls.add(url);
      }
    }

    return {
      items: Array.from(seenUrls).map((url: any) => ({
        id: url,
        title: url.split("/").filter(Boolean).pop()?.replace(/-/g, " ").toUpperCase() || "Movie",
        image: "",
        url: url,
      })),
      hasNextPage: true,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { items: [], hasNextPage: false };
  }
};