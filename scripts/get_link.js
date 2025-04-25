// Number of days to keep cache (i.e. cached url expires after x days)
const CACHE_LIFETIME_DAYS = 30;

// Get url and remove trailing slash
const currentUrl = window.location.href;
const shortUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;
console.info("Page URL:", shortUrl);
// Start redirection process
start(shortUrl);

/***************
*  FUNCTIONS   *
***************/
// On init, validate url, check for cached link or get from database, redirect user
function start(url) {
    // Validate url and get key section
    const url_key = parseUrl(url);
    console.log('URL key:', url_key);
    if (!url_key) {
        redirectUser('/404');
        return;
    }
    // Check for cached link
    const cachedLink = getLinkCache(url);
    if (cachedLink) {
        redirectUser(cachedLink);
        return;
    }
    // If not cached, reach out to database
    console.info('No cached link available. Reaching out to database...');
    getLink(url);
}

function parseUrl(url) {
    try {
        // Ensure the URL is properly formatted
        const parsedUrl = new URL(url);
        // Extract query parameters safely
        const url_key = parsedUrl.searchParams.get('key') || null;
        // Validate url key
        if (!url_key || !/^[a-zA-Z0-9]{4,30}$/.test(url_key)) {
            console.error('Invalid URL');
            return null;
        }
        return url_key;
    } catch (error) {
        return null;
    }
}

function redirectUser(link) {
    console.info('Redirecting to', link);
    // Set title to redirecting
    document.getElementsByTagName('title')[0].textContent = "Redirecting...";
    // Set body to link in case redirect fails
    document.body.querySelector('p').innerHTML = `If you are not redirected, follow this link:  <br/>  <a href="${link}">${link}</a>`;
    // Add meta tag to redirect
    var meta = document.createElement('meta');
    meta.httpEquiv = "refresh";
    meta.content = `0;url=${link}`;
    // document.getElementsByTagName('head')[0].appendChild(meta);
}

// Check for and validate cached link, redirect user to long link if available
function getLinkCache(item) {
    var cached = localStorage.getItem(item);
    console.log('Cached link:', cached);
    if (cached) {
        cached = JSON.parse(cached);
        const now = new Date();
        const accessedDate = new Date(cached.accessed_at);
        const diffTime = Math.abs(now - accessedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= CACHE_LIFETIME_DAYS) {
            console.info(`This url is cached for another ${CACHE_LIFETIME_DAYS - diffDays} days.`);
            return cached.long_url;
        }
        else {
            console.info('Cached link is too old. Cleaning up...');
            localStorage.removeItem(shortUrl);
        }
    }
    return null;
}

// Grab the long link the corresponds to this short link from the database
async function getLink(short_url) {
    try {
        // Reach out to database and get long url that corresponds to short url
        // const { data, error } = await supabase.functions.invoke('redirect', { body: { short_url: short_url } });
        const data = null;
        const error = null

        // Check for errors
        // If error exists, we handle it based on its type.
        if (error) {
            var errorDetails;
            try {
                const errorDetailsJson = (await error.context.json()).error;
                errorDetails = `<b>${errorDetailsJson.code}</b> - ${errorDetailsJson.message}`;
                // Specific "not found" error returned by .single()
                if (errorDetailsJson.code === "PGRST116") {
                    redirectUser('/nfd');
                    return;
                }
            }
            catch {
                errorDetails = error;
            }
            throw errorDetails;
        }
        // As an extra safety measure—if data is somehow falsy even without an error.
        if (!data) {
            redirectUser('/nfd');
            return;
        }
        console.info('Got long url:', data.long_url);
        localStorage.setItem(shortUrl, JSON.stringify({ long_url: data.long_url, accessed_at: new Date().toISOString() }));
        redirectUser(data.long_url);
    } catch (err) {
        console.error('Unexpected error:', err);
        redirectUser('/rip');
    }
}