import './404.css';

export default function NotFoundErrorApp() {
    return (
        <>
            <header>
                <h1 class="logo" onclick="window.location.href = '/'" title="shortUrl by setul">shortUrl</h1>
            </header>
            <div class="container">
                <div class="image-container">
                    <img class="image404" src="./src/assets/404.svg" alt="404" />
                </div>
                <div class="content-container">
                    <div class="content">
                        <h1>404 Page Not Found</h1>
                        <h2>Must've been the wind...</h2>
                        <p>Oops! The short url you entered doesn't exist.</p>
                        <button class="primary-button" href="/" title="Generate a short url">Generate one!</button>
                    </div>
                </div>
            </div>
            <footer>Copyright © 2025 Setul Parekh. All rights reserved.</footer>
        </>
    )
}

