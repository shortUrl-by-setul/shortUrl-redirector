// Init Theme
const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const storedTheme = getThemeCookie();
var theme = storedTheme || osTheme;
console.log('Post-processed theme:', theme);
document.body.setAttribute('data-theme', theme);
// Setup theme change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onDeviceThemeChange);
// setThemeCookie('light');
// delete_cookie('short-url-theme', '/');

function delete_cookie(name, path, domain) {
    if (getThemeCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function setThemeCookie(theme) {
    // Set a cookie with the theme preference
    document.cookie = `short-url-theme=${theme}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`; // ; domain=.setulp.com
    console.info('Theme cookie set:', document.cookie);
}

// Check for cookie that has current theme option
function getThemeCookie() {
    const cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('short-url-theme=')) {
            const value = cookie.split('=')[1];
            console.info('Theme cookie found:', value);
            return value;
        }
    }
    console.info("No theme cookie found. Refering to device theme");
    return null;
}


function onDeviceThemeChange(event) {
    if (!storedTheme) {
        const osTheme = event.matches ? 'dark' : 'light';
        if (osTheme !== theme) {
            // Update theme if changed
            document.documentElement.style.setProperty("--quick-transition-duration", "var(--slow-transition-duration)");
            document.body.setAttribute('data-theme', osTheme);
            theme = osTheme;
            console.info('Device theme has changed:', theme);
            setTimeout(() => {
                document.documentElement.style.setProperty("--quick-transition-duration", "0.15s");
            }, 400);
        }
    }
}