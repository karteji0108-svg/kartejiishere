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
        time.sleep(3)

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
