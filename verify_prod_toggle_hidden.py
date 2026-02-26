from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        print("Navigating to http://localhost:4173")
        try:
            page.goto("http://localhost:4173")
        except Exception as e:
            print(f"Error navigating: {e}")
            browser.close()
            return

        # wait a bit for react hydration
        time.sleep(2)

        print("Checking for toggle button...")
        # Check if the toggle button exists
        toggle = page.query_selector("text=🌙 OFF")

        if toggle:
            if toggle.is_visible():
                print("FAIL: Toggle button found and visible!")
            else:
                print("INFO: Toggle button found but not visible (hidden via CSS?)")
        else:
            print("SUCCESS: Toggle button NOT found in DOM.")

        # Also check for 'ON' state just in case
        toggle_on = page.query_selector("text=🌙 ON")
        if toggle_on:
             if toggle_on.is_visible():
                print("FAIL: Toggle button (ON) found and visible!")

        page.screenshot(path="verification_prod_hidden.png")
        browser.close()

if __name__ == "__main__":
    run()
