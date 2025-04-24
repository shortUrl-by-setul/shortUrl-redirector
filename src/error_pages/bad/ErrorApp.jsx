import './Bad.css';


// Number of days to keep cache (i.e. cached url expires after x days)
const CACHE_LIFETIME_DAYS = 30;

export default function ErrorApp() {
    return (
        <>
            <header>
                <h1 class="logo" onclick="window.location.href = '/'" title="shortUrl by setul">shortUrl</h1>
            </header>
            <div class="container">
                <div class="image-container">
                    <img class="image404" src="./src/assets/error.svg" alt="404" />
                </div>
                <div class="content-container">
                    <div class="content">
                        <h1>Something went wrong</h1>
                        <h2>That wasn't supposed to happen...</h2>
                        <p>Oops! Your short url couldn't be processed. Try again later.</p>
                        <button type="button" class="primary-button" title="Go back to the previous page"
                            onclick="history.back()">
                            Go back
                        </button>
                    </div>
                </div>
            </div>
            <footer>Copyright © 2025 Setul Parekh. All rights reserved.</footer>
        </>
    )
}

