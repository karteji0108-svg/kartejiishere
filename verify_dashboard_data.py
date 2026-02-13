import time
import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # We can't really verify dashboard data fetching without a real user login
        # But we can verify that the dashboard loads the "loading" state or redirection logic

        page.goto("http://localhost:5173/dashboard")
        try:
            # Wait for redirection away from dashboard (e.g. to /login or /).
            # We use a timeout of 3000ms (matching the original sleep duration)
            # but this will return much faster if the redirect happens quickly.
            page.wait_for_url(lambda u: "/dashboard" not in u, timeout=3000)
        except Exception:
            print("Timeout waiting for redirect from /dashboard")

        url = page.url
        print(f"Current URL: {url}")

        if "/login" in url or url == "http://localhost:5173/":
             print("Protected route /dashboard redirected correctly (since we are not logged in)")
        else:
             print("Warning: /dashboard did not redirect to login")
             page.screenshot(path="verify_dashboard_data/dashboard_fail.png")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verify_dashboard_data"):
        os.makedirs("verify_dashboard_data")
    run()
