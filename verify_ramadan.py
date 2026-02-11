import time
import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5173")
        # page.wait_for_load_state("networkidle") # Sometimes flaky with vite dev server websocket
        time.sleep(2)

        # Take initial screenshot (Normal)
        page.screenshot(path="verify_ramadan/1_login_normal.png")
        print("Captured Login Normal")

        # Click the debug toggle
        # It's in the bottom left, fixed position.
        # Button text: "🌙 OFF" initially
        try:
            page.click("text=🌙 OFF", timeout=2000)
            print("Clicked Toggle")
        except:
            print("Could not find toggle button. Is RamadanContext mounted?")
            page.screenshot(path="verify_ramadan/error_no_toggle.png")
            browser.close()
            return

        time.sleep(1) # Wait for transition

        # Take screenshot (Ramadan)
        page.screenshot(path="verify_ramadan/2_login_ramadan.png")
        print("Captured Login Ramadan")

        # Login
        page.fill('input[type="email"]', "admin@example.com")
        page.fill('input[type="password"]', "password")
        page.click('button[type="submit"]')

        page.wait_for_url("**/dashboard")
        time.sleep(1)

        # Dashboard Ramadan
        page.screenshot(path="verify_ramadan/3_dashboard_ramadan.png")
        print("Captured Dashboard Ramadan")

        # Activities
        page.goto("http://localhost:5173/activities")
        time.sleep(1)
        page.screenshot(path="verify_ramadan/4_activities_ramadan.png")
        print("Captured Activities Ramadan")

        # Announcements
        page.goto("http://localhost:5173/announcements")
        time.sleep(1)
        page.screenshot(path="verify_ramadan/5_announcements_ramadan.png")
        print("Captured Announcements Ramadan")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verify_ramadan"):
        os.makedirs("verify_ramadan")
    run()
