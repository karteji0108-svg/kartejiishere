from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Login first (mocking or real if needed, but here we assume we can reach /finance if auth allows, or we mock auth)
        # Since I can't easily mock auth in this script without complex setup, I'll rely on the preview server running and try to access.
        # But wait, the app likely redirects to login.
        # I'll try to login.

        page.goto("http://localhost:4173")
        time.sleep(2)

        # Login
        try:
            page.fill('input[type="email"]', "admin@example.com")
            page.fill('input[type="password"]', "password")
            page.click('button[type="submit"]')
            page.wait_for_url("**/dashboard", timeout=5000)
            print("Login successful")
        except:
            print("Login failed or already logged in")

        # Verify Finance UI
        print("Navigating to Finance...")
        page.goto("http://localhost:4173/finance")
        time.sleep(2)

        # Check for new UI elements
        # Check if background has dynamic class (we can't easily check class values in python without js eval, but we can screenshot)
        page.screenshot(path="verification_finance_ui.png")
        print("Captured Finance UI")

        # Check for specific new elements
        # e.g., the specific header structure
        header = page.query_selector("header")
        if header:
            print("Finance Header found")

        # Verify Profile UI
        print("Navigating to Profile...")
        page.goto("http://localhost:4173/profile")
        time.sleep(2)
        page.screenshot(path="verification_profile_ui.png")
        print("Captured Profile UI")

        browser.close()

if __name__ == "__main__":
    run()
