import time
import logging
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

load_dotenv()

log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, f'todo_test_{datetime.now().strftime("%d-%m-%Y(%H-%M-%S)")}.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file, encoding='utf-8'),
        logging.StreamHandler() 
    ]
)
logger = logging.getLogger(__name__)

TODO_APP_URL = os.getenv('TODO_APP_URL', 'http://localhost:3000')  
WAIT_TIMEOUT = int(os.getenv('WAIT_TIMEOUT', '10'))  

class TodoAutomationAdvanced:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--lang=en-US")
        chrome_options.add_experimental_option("detach", True)
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, WAIT_TIMEOUT)
        self.driver.maximize_window()
        
        self.todo_texts = [
            "Complete project documentation",
            "Review code changes",
            "Schedule team meeting",
            "Update database schema",
            "Test new features"
        ]
        
        self.stats = {
            'todos_added': 0,
            'todos_completed': 0,
            'todos_deleted': 0,
            'todos_updated': 0,
            'errors': 0
        }
        
    def wait_for_app_ready(self):
        try:
            self.wait.until(EC.presence_of_element_located((By.ID, "todo-container")))
            
            self.wait.until(EC.element_to_be_clickable((By.ID, "todo-input")))
            
            logger.info("[OK] Todo application is ready")
            return True
            
        except TimeoutException:
            logger.error("[X] Timeout waiting for app to be ready")
            return False
    
    def open_todo_app(self):
        try:
            logger.info(f"Opening Todo application at {TODO_APP_URL}")
            self.driver.get(TODO_APP_URL)
            
            if self.wait_for_app_ready():
                logger.info("[OK] Todo application loaded successfully")
                return True
            else:
                return False
            
        except Exception as e:
            logger.error(f"[X] Failed to load Todo application: {e}")
            return False
    
    def add_todo(self, todo_text):
        try:
            input_field = self.wait.until(EC.element_to_be_clickable((By.ID, "todo-input")))
            submit_button = self.wait.until(EC.element_to_be_clickable((By.ID, "todo-submit-btn")))
            
            initial_count = len(self.driver.find_elements(By.CLASS_NAME, "todo-item"))
            
            input_field.clear()
            input_field.send_keys(todo_text)
            time.sleep(0.3)
            
            submit_button.click()
            
            self.wait.until(lambda driver: len(driver.find_elements(By.CLASS_NAME, "todo-item")) > initial_count)
            
            self.stats['todos_added'] += 1
            logger.info(f"[OK] Added todo: '{todo_text}'")
            return True
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"[X] Failed to add todo '{todo_text}': {e}")
            return False
    
    def add_multiple_todos(self):
        logger.info("--- Adding 5 Todo Items ---")
        success_count = 0
        
        for i, todo_text in enumerate(self.todo_texts, 1):
            logger.info(f"Adding todo {i}/5: {todo_text}")
            if self.add_todo(todo_text):
                success_count += 1
            time.sleep(0.8) 
        
        logger.info(f"[OK] Successfully added {success_count}/5 todos")
        return success_count == 5
    
    def find_todo_by_text(self, text_fragment):
        try:
            todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            for i, item in enumerate(todo_items):
                todo_text_elem = item.find_element(By.CLASS_NAME, "todo-text")
                if text_fragment.lower() in todo_text_elem.text.lower():
                    return i + 1 
            return None
        except Exception as e:
            logger.error(f"Error finding todo by text: {e}")
            return None
    
    def toggle_todo_status(self, todo_index, mark_complete=True):
        try:
            todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            
            if todo_index > len(todo_items):
                logger.error(f"[X] Todo index {todo_index} not found. Only {len(todo_items)} todos exist")
                return False
            
            target_todo = todo_items[todo_index - 1]
            
            checkbox = target_todo.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
            
            is_currently_checked = checkbox.is_selected()
            
            if (mark_complete and not is_currently_checked) or (not mark_complete and is_currently_checked):
                self.driver.execute_script("arguments[0].scrollIntoView(true);", checkbox)
                time.sleep(0.2)
                
                checkbox.click()
                time.sleep(0.5)
                
                new_status = checkbox.is_selected()
                status_text = "completed" if mark_complete else "active"
                
                if new_status == mark_complete:
                    if mark_complete:
                        self.stats['todos_completed'] += 1
                    logger.info(f"[OK] Todo {todo_index} marked as {status_text}")
                    return True
                else:
                    self.stats['errors'] += 1
                    logger.error(f"[X] Failed to change status of todo {todo_index}")
                    return False
            else:
                logger.info(f"[INFO] Todo {todo_index} already has the desired status")
                return True
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"[X] Failed to toggle todo {todo_index}: {e}")
            return False
    
    def delete_todo(self, todo_index):
        try:
            todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            initial_count = len(todo_items)
            
            if todo_index > initial_count:
                logger.error(f"[X] Todo index {todo_index} not found. Only {initial_count} todos exist")
                return False
            
            target_todo = todo_items[todo_index - 1]
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", target_todo)
            time.sleep(0.2)
            
            delete_button = target_todo.find_element(By.CSS_SELECTOR, "button[id*='delete-btn']")
            delete_button.click()
            
            self.wait.until(lambda driver: len(driver.find_elements(By.CLASS_NAME, "todo-item")) < initial_count)
            
            self.stats['todos_deleted'] += 1
            logger.info(f"[OK] Todo {todo_index} deleted successfully")
            return True
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"[X] Failed to delete todo {todo_index}: {e}")
            return False
    
    def update_todo(self, todo_index, new_text):
        try:
            todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            
            if todo_index > len(todo_items):
                logger.error(f"[X] Todo index {todo_index} not found. Only {len(todo_items)} todos exist")
                return False
            
            target_todo = todo_items[todo_index - 1]
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", target_todo)
            time.sleep(0.2)
            
            edit_button = target_todo.find_element(By.CSS_SELECTOR, "button[id*='edit-btn']")
            edit_button.click()
            time.sleep(0.5)
            
            input_field = self.wait.until(EC.element_to_be_clickable((By.ID, "todo-input")))
            
            input_field.clear()
            input_field.send_keys(new_text)
            time.sleep(0.5)
            
            submit_button = self.wait.until(EC.element_to_be_clickable((By.ID, "todo-submit-btn")))
            submit_button.click()
            
            time.sleep(1)
            
            updated_todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            for item in updated_todo_items:
                todo_text_elem = item.find_element(By.CLASS_NAME, "todo-text")
                if new_text in todo_text_elem.text:
                    self.stats['todos_updated'] += 1
                    logger.info(f"[OK] Todo {todo_index} updated to: '{new_text}'")
                    return True
            
            self.stats['errors'] += 1
            logger.error(f"[X] Failed to verify update of todo {todo_index}")
            return False
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"[X] Failed to update todo {todo_index}: {e}")
            return False
    
    def use_filter(self, filter_type):
        try:
            filter_container = self.driver.find_elements(By.ID, "filter-container")
            if not filter_container:
                logger.warning(f"[WARNING] Filter container not found - no todos to filter")
                return False
                
            filter_button = self.wait.until(EC.element_to_be_clickable((By.ID, f"filter-{filter_type}")))
            
            self.driver.execute_script("arguments[0].scrollIntoView(true);", filter_button)
            time.sleep(0.2)
            
            filter_button.click()
            time.sleep(1)
            
            if "active" in filter_button.get_attribute("class"):
                logger.info(f"[OK] Filter '{filter_type}' applied successfully")
                return True
            else:
                logger.error(f"[X] Failed to apply filter '{filter_type}'")
                return False
                
        except Exception as e:
            logger.error(f"[X] Failed to use filter '{filter_type}': {e}")
            return False
    
    def get_todo_count(self):
        try:
            todo_items = self.driver.find_elements(By.CLASS_NAME, "todo-item")
            count = len(todo_items)
            logger.info(f"[INFO] Current todo count: {count}")
            return count
        except Exception as e:
            logger.error(f"[X] Failed to get todo count: {e}")
            return 0
    
    def take_screenshot(self, name):
        try:
            screenshot_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
            os.makedirs(screenshot_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%H-%M-%S")
            filename = os.path.join(screenshot_dir, f"{name}_{timestamp}.png")
            
            self.driver.save_screenshot(filename)
            logger.info(f"[OK] Screenshot saved: {filename}")
            
        except Exception as e:
            logger.error(f"[X] Failed to take screenshot: {e}")
    
    def run_test_scenario(self):
        logger.info("=== Starting Todo Application Test Automation ===")
        
       
        if not self.open_todo_app():
            return False
        
        self.take_screenshot("01_initial_state")
        
        
        if not self.add_multiple_todos():
            return False
        
        self.take_screenshot("02_after_adding_todos")
        time.sleep(2)
        
        
        logger.info("--- Managing Todo Status ---")
        
        
        self.toggle_todo_status(1, mark_complete=True)
        time.sleep(1)
        
        
        self.toggle_todo_status(2, mark_complete=True)
        time.sleep(1)
        
        self.take_screenshot("03_after_completing_todos")
        
        
        self.toggle_todo_status(1, mark_complete=False)
        time.sleep(2)
        
        self.take_screenshot("04_after_making_todo1_active")
        
        
        logger.info("--- Deleting Todo ---")
        self.delete_todo(3)
        time.sleep(2)
        
        self.take_screenshot("05_after_deletion")
        
        
        logger.info("--- Updating Todo ---")
        self.update_todo(1, "UPDATED: High priority task - Modified by automation")
        time.sleep(2)
        
        self.take_screenshot("06_after_update")
        
        
        logger.info("--- Testing Filters ---")
        
        
        self.use_filter("all")
        time.sleep(1)
        all_count = self.get_todo_count()
        self.take_screenshot("07_filter_all")
        
        
        self.use_filter("active")
        time.sleep(1)
        active_count = self.get_todo_count()
        self.take_screenshot("08_filter_active")
        
        
        self.use_filter("completed")
        time.sleep(1)
        completed_count = self.get_todo_count()
        self.take_screenshot("09_filter_completed")
        
        
        self.use_filter("all")
        time.sleep(1)
        self.take_screenshot("10_final_state")
        
        
        logger.info("--- Final Test Results ---")
        logger.info(f"Total todos: {all_count}")
        logger.info(f"Active todos: {active_count}")
        logger.info(f"Completed todos: {completed_count}")
        
        
        logger.info("--- Automation Statistics ---")
        logger.info(f"Todos added: {self.stats['todos_added']}")
        logger.info(f"Todos completed: {self.stats['todos_completed']}")
        logger.info(f"Todos deleted: {self.stats['todos_deleted']}")
        logger.info(f"Todos updated: {self.stats['todos_updated']}")
        logger.info(f"Errors encountered: {self.stats['errors']}")
        
        logger.info("[OK] Test scenario completed successfully!")
        return True
    
    def cleanup(self):
        try:
            time.sleep(3)  
            self.driver.quit()
            logger.info("Browser closed successfully")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

def main():
    automation = TodoAutomationAdvanced()
    
    try:
        success = automation.run_test_scenario()
        
        if success:
            logger.info("=== Test Automation Completed Successfully ===")
        else:
            logger.error("=== Test Automation Failed ===")
            
    except KeyboardInterrupt:
        logger.info("Test automation interrupted by user")
        
    except Exception as e:
        logger.error(f"Unexpected error during test execution: {e}")
        
    finally:
        automation.cleanup()

if __name__ == "__main__":
    main()
