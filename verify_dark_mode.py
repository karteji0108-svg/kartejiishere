from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate mobile viewport
        context = browser.new_context(viewport={'width': 375, 'height': 812})
        page = context.new_page()

        try:
            # 1. Login Page Light
            print("Navigating to Login Page...")
            page.goto('http://localhost:5173/')
            page.wait_for_selector('text=Karang Taruna', timeout=10000)
            page.screenshot(path='1_login_light.png')
            print("Captured 1_login_light.png")

            # 2. Toggle to Dark Mode on Login Page
            print("Toggling Dark Mode on Login Page...")
            toggle_btn = page.locator('button[aria-label="Toggle Dark Mode"]')
            toggle_btn.click()
            time.sleep(1) # Wait for transition
            page.screenshot(path='2_login_dark.png')
            print("Captured 2_login_dark.png")

            # 3. Login
            print("Logging in...")
            page.fill('input[type="email"]', 'admin@example.com')
            page.fill('input[type="password"]', 'password')
            page.click('button[type="submit"]')

            # Wait for Dashboard
            page.wait_for_url('**/dashboard')
            page.wait_for_selector('text=Ringkasan', timeout=10000)
            time.sleep(1)
            page.screenshot(path='3_dashboard_dark.png')
            print("Captured 3_dashboard_dark.png")

            # 4. Go to Profile (should be dark)
            print("Navigating to Profile...")
            page.click('a:has-text("Profil")')
            page.wait_for_selector('h1:has-text("Profil")', timeout=10000)
            time.sleep(1)
            # Scroll down to ensure Tampilan section is visible
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(0.5)
            page.screenshot(path='4_profile_dark.png')
            print("Captured 4_profile_dark.png")

            # 5. Toggle to Light Mode in Profile
            print("Toggling to Light Mode in Profile...")
            # Use specific locator for the toggle button in Tampilan section
            # It's inside a div with "Tema Gelap" text.
            # We can use text locator to find the label, then find the button in the same container.
            # Or use the sr-only text.

            # Locating the button by sr-only text:
            # Note: Playwright's locator by text works for visible text by default.
            # We can use CSS selector for sr-only inside button.
            toggle_button = page.locator('button:has(span.sr-only:text("Toggle Dark Mode"))').last
            toggle_button.scroll_into_view_if_needed()
            toggle_button.click()

            time.sleep(1)
            page.screenshot(path='5_profile_light.png')
            print("Captured 5_profile_light.png")

            # 6. Check Members List in Light
            print("Navigating to Members List...")
            page.click('a:has-text("Anggota")')
            page.wait_for_selector('text=Daftar Anggota', timeout=10000)
            time.sleep(1)
            page.screenshot(path='6_members_light.png')
            print("Captured 6_members_light.png")

            # 7. Check Activities in Light
            print("Navigating to Activities...")
            page.click('a:has-text("Kegiatan")')
            page.wait_for_selector('text=Kegiatan', timeout=10000)
            time.sleep(1)
            page.screenshot(path='7_activities_light.png')
            print("Captured 7_activities_light.png")

            # 8. Check Announcements in Light
            print("Navigating to Announcements...")
            page.click('a:has-text("Dashboard")')
            page.wait_for_selector('text=Ringkasan', timeout=10000)

            # Click Info Baru button
            page.click('a[href="/announcements"]')
            page.wait_for_selector('text=Pengumuman', timeout=10000)
            time.sleep(1)
            page.screenshot(path='8_announcements_light.png')
            print("Captured 8_announcements_light.png")

            # 9. Toggle Dark Mode again via Profile
            print("Going back to Profile to enable Dark Mode...")
            page.click('a:has-text("Profil")')

            toggle_button = page.locator('button:has(span.sr-only:text("Toggle Dark Mode"))').last
            toggle_button.scroll_into_view_if_needed()
            toggle_button.click()
            time.sleep(1)

            print("Checking Announcements in Dark Mode...")
            page.click('a:has-text("Dashboard")')
            page.click('a[href="/announcements"]')
            page.wait_for_selector('text=Pengumuman')
            time.sleep(1)
            page.screenshot(path='9_announcements_dark.png')
            print("Captured 9_announcements_dark.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path='error.png')
        finally:
            browser.close()

if __name__ == '__main__':
    run()
