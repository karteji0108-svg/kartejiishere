import time
import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Test 1: Accessing a protected route should redirect to login
        page.goto("http://localhost:5173/dashboard")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        url = page.url
        print(f"Attempted /dashboard, landed on: {url}")
        if "/login" in url or url == "http://localhost:5173/":
             print("SUCCESS: Protected route redirected to Login")
        else:
             print("FAILURE: Protected route did NOT redirect to Login")
             page.screenshot(path="verify_auth/fail_redirect.png")

        # Test 2: Verify Login Page UI (with Auth Integration)
        # We can't actually login because we don't have a real user in the new firebase project without seeding it or creating one.
        # But we can verify the Register page exists and fields are there.

        page.goto("http://localhost:5173/register")
        time.sleep(1)
        page.screenshot(path="verify_auth/register_page.png")
        print("Captured Register Page")

        # Verify fields
        if page.is_visible('input[name="name"]') and page.is_visible('input[name="email"]'):
            print("SUCCESS: Register fields visible")
        else:
            print("FAILURE: Register fields missing")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verify_auth"):
        os.makedirs("verify_auth")
    run()
