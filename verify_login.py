from playwright.sync_api import sync_playwright

def verify_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Go to the login page (root)
            page.goto("http://localhost:3000")

            # Wait for the title "KARTEJI" to appear
            page.wait_for_selector("text=KARTEJI")

            # Take a screenshot
            page.screenshot(path="login_verification.png")
            print("Login verification successful. Screenshot saved to login_verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="login_verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_login()
