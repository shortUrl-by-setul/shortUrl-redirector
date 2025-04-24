import { useState, useEffect } from 'react';
// import { supabase } from './supabase';
import './App.css';

// Number of days to keep cache (i.e. cached url expires after x days)
const CACHE_LIFETIME_DAYS = 30;

export default function RedirectorApp({ url_key }) {
  RedirectorApp.propTypes = {
    url_key: String
  };

  // Get link
  const shortUrl = 'https://url.setulp.com/' + url_key;
  console.log('Short URL key:', url_key);
  // Setup message
  const [message, setMessage] = useState(null);
  // Init Theme
  const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const storedTheme = checkThemeCookie();
  const [theme, setTheme] = useState(storedTheme || osTheme);

  // On init, validate url, check for cached link or get from database, setup theme listener, redirect user
  useEffect(() => {
    if (!url_key || !/^[a-zA-Z0-9]{4,30}$/.test(url_key)) {
      console.error('Invalid URL');
      redirectUser('/404');
      return;
    }
    if (!checkLinkCache(url_key)) {
      // If not cached, reach out to database
      console.info('No cached link available. Reaching out to database...');
      getLink();
    }
    function onDeviceThemeChange(event) {
      if (!storedTheme) {
        const osTheme = event.matches ? 'dark' : 'light';
        if (osTheme !== theme) {
          // Update theme if changed
          document.documentElement.style.setProperty("--quick-transition-duration", "var(--slow-transition-duration)");
          document.body.setAttribute('data-theme', osTheme);
          setTheme(osTheme);
          setTimeout(() => {
            document.documentElement.style.setProperty("--quick-transition-duration", "0.15s");
          }, 400);
        }
      }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onDeviceThemeChange);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onDeviceThemeChange);
    };
  }, []);

  // Check for cookie that has current theme option
  function checkThemeCookie() {
    var cookies = document.cookie.split(';');
    console.log('Cookies:', cookies);
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.startsWith('short-url-theme=')) {
        console.info('Theme cookie found. Updating theme.');
        return cookie.split('=')[1];
      }
    }
    console.info("No theme cookie found. Refering to device theme");
    return null;
  }

  // Check for and validate cached link, redirect user to long link if available
  function checkLinkCache(item) {
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
        redirectUser(cached.long_url);
        return true;
      }
      else {
        console.info('Cached link is too old. Cleaning up...');
        localStorage.removeItem(shortUrl);
      }
    }
    return false;
  }

  // Redirect user to another page
  function redirectUser(link) {
    console.info('Redirecting to', link);
    // Set title to redirecting
    document.getElementsByTagName('title')[0].textContent = "Redirecting...";
    // Set body to link in case redirect fails
    setMessage(<p>If you are not redirected, follow this link: <br /><a href={link}>{link}</a></p>);
    // Add meta tag to redirect
    var meta = document.createElement('meta');
    meta.httpEquiv = "refresh";
    meta.content = `0;url=${link}`;
    // document.getElementsByTagName('head')[0].appendChild(meta);
  }

  // Grab the long link the corresponds to this short link from the database
  async function getLink() {
    try {
      // Reach out to database and get long url that corresponds to short url
      // const { data, error } = await _supabase
      //     .from('links')
      //     .select('long_url')
      //     .eq('short_url', 'https://url.setulp.com/yet-another')
      //     .single();
      // const { data, error } = await supabase.functions.invoke('redirect', { body: { short_url: 'https://url.setulp.com/yet-another' } });
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
            redirectUser('/404');
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
        redirectUser('/404');
        return;
      }
      console.info('Got long url:', data.long_url);
      localStorage.setItem(shortUrl, JSON.stringify({ long_url: data.long_url, accessed_at: new Date().toISOString() }));
      redirectUser(data.long_url);
    } catch (err) {
      console.error('Unexpected error:', err);
      redirectUser('/bad');
      // const bodyText = document.body.querySelector('p');
      // bodyText.innerHTML = `Something went wrong. Try again later. <br/> <span style="color: rgb(from red r g b / 70%);">${err}</span>`;
    }
  }

  return (
    <>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {message}
    </>
  )
}

