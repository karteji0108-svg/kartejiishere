from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        print("Navigating to Dashboard...")
        # Assuming dev server is already running on 5173
        page.goto("http://localhost:5173/dashboard")

        # Wait for potential redirects (login)
        time.sleep(2)

        print(f"Current URL: {page.url}")

        if "/login" in page.url:
            print("Redirected to login. Taking screenshot of Login UI...")
            page.screenshot(path="verification/login_ui.png")
            # We can't easily bypass login in this automated script without credentials,
            # but we can verify global styles on login page too.
        else:
            print("Taking screenshot of Dashboard UI...")
            # Wait for content to load
            time.sleep(2)
            page.screenshot(path="verification/dashboard_ui.png")

        browser.close()

if __name__ == "__main__":
    run()
