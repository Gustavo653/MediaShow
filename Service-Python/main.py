import argparse
import time

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Constants
LOGIN_PAGE1_SELECTOR = "#email"
LOGIN_PAGE2_SELECTOR = "#i0116"
PASSWORD_SELECTOR = "#i0118"
SUBMIT_BTN_SELECTOR = "#submitBtn"
SI_BUTTON_SELECTOR = "#idSIButton9"
BACK_BTN_SELECTOR = "#idBtn_Back"
EXPORT_MENU_BTN_SELECTOR = "#exportMenuBtn"
OK_BUTTON_SELECTOR = "#okButton"
POWERBI_CHECKBOX_XPATH = '//*[@id="$pbi-checkbox-3"]'
POWERBI_EXPORT_MENU = "#mat-menu-panel-2 > div > button:nth-child(3)"
POWERBI_EXPORT_NOTIFICATION = "#cdk-overlay-8 > snack-bar-container > div > div > notification-toast > section"


def main():
    options = parse_arguments()

    print(f"URL: {options.url}")
    print(f"Login: {options.login}")
    print(f"Senha: {options.password}")

    chrome_options = ChromeOptions()
    # chrome_options.add_argument("--headless")

    with webdriver.Chrome(options=chrome_options) as driver:
        driver.get(options.url)

        automation_type = options.type

        if automation_type == 'powerbi':
            perform_powerbi_automation(options, driver)
        elif automation_type == 'other_scenario':
            perform_other_scenario(options, driver)
        else:
            print(f"Invalid automation type: {automation_type}")

    close_application()


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", "--url", required=True, help="URL da página que deve ser aberta")
    parser.add_argument("-l", "--login", required=True, help="Login")
    parser.add_argument("-p", "--password", required=True, help="Senha")
    parser.add_argument("-t", "--type", choices=['powerbi', 'other_scenario'], default='powerbi',
                        help="Tipo de automação")
    return parser.parse_args()


def perform_powerbi_automation(options, driver):
    time.sleep(5)
    if is_login_page1(driver):
        perform_login_page1(options.login, options.password, driver)
    elif is_login_page2(driver):
        perform_login_page2(options.login, options.password, driver)
    else:
        raise ValueError("Unrecognized login page")

    click_and_wait_for_element(EXPORT_MENU_BTN_SELECTOR, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(POWERBI_EXPORT_MENU, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(POWERBI_CHECKBOX_XPATH, driver, By.XPATH)
    click_and_wait_for_element(OK_BUTTON_SELECTOR, driver, By.CSS_SELECTOR)

    time.sleep(2)

    wait_for_element_to_be_invisible(POWERBI_EXPORT_NOTIFICATION, driver, By.CSS_SELECTOR)


def wait_for_element_to_be_invisible(selector, driver, by):
    wait = WebDriverWait(driver, 10)
    wait.until(EC.invisibility_of_element_located((by, selector)))


def is_login_page1(driver):
    return element_exists(LOGIN_PAGE1_SELECTOR, driver, By.CSS_SELECTOR)


def is_login_page2(driver):
    return element_exists(LOGIN_PAGE2_SELECTOR, driver, By.CSS_SELECTOR)


def element_exists(selector, driver, by):
    try:
        driver.find_element(by, selector)
        return True
    except NoSuchElementException:
        return False


def perform_login_page1(login, password, driver):
    fill_text_field(login, LOGIN_PAGE1_SELECTOR, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(SUBMIT_BTN_SELECTOR, driver, By.CSS_SELECTOR)

    fill_text_field(password, PASSWORD_SELECTOR, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(SI_BUTTON_SELECTOR, driver, By.CSS_SELECTOR)

    click_and_wait_for_element(BACK_BTN_SELECTOR, driver, By.CSS_SELECTOR)


def perform_login_page2(login, password, driver):
    fill_text_field(login, LOGIN_PAGE2_SELECTOR, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(SI_BUTTON_SELECTOR, driver, By.CSS_SELECTOR)

    fill_text_field(password, PASSWORD_SELECTOR, driver, By.CSS_SELECTOR)
    click_and_wait_for_element(SI_BUTTON_SELECTOR, driver, By.CSS_SELECTOR)

    click_and_wait_for_element(BACK_BTN_SELECTOR, driver, By.CSS_SELECTOR)


def perform_other_scenario(options, driver):
    pass


def click_and_wait_for_element(selector, driver, by):
    wait = WebDriverWait(driver, 10)
    element = wait.until(EC.element_to_be_clickable((by, selector)))
    element.click()


def fill_text_field(value, selector, driver, by):
    wait = WebDriverWait(driver, 10)
    field = wait.until(EC.visibility_of_element_located((by, selector)))
    field.send_keys(value)


def close_application():
    input("Pressione qualquer tecla para fechar")


if __name__ == "__main__":
    main()
