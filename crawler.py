"""
Before running this script, you need to install the following packages: beautifulsoup4, selenium, tqdm, pymongo, fake_useragent. You also need to set up the webdriver of your preferred browser for selenium (here i use Chrome). You also need to have a MongoDB database to store the data. You can create a free account at https://www.mongodb.com and get the connection string. Replace the CONNECTION_STRING variable with your connection string. 
"""
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver.support import expected_conditions as EC
from fake_useragent import UserAgent
from tqdm import tqdm
from pymongo import MongoClient

CONNECTION_STRING = '' # Your connection string here

ua = UserAgent()

def get_driver():
    user_agent = ua.random
    options = webdriver.ChromeOptions()
    options.add_argument(f'--user-agent={user_agent}')
    options.add_argument('--incognito')
    driver = webdriver.Chrome(options=options)
    return driver


def get_mammals_list():
    driver = get_driver()

    driver.get('https://www.animalia.bio/mammals')

    for i in range(151):
        try:
            load_more_button = WebDriverWait(driver, 4).until(EC.presence_of_element_located((By.CLASS_NAME, 'load-more')))
            driver.execute_script("arguments[0].scrollIntoView(true);", load_more_button)
            WebDriverWait(driver, 6).until(EC.element_to_be_clickable((By.CLASS_NAME, 'load-more'))).click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click();", load_more_button)

    with open('mammals.html', 'w') as f:
        f.write(driver.page_source)

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    with open('mammals.txt', 'w') as f:
        for animal in soup.find_all('a', {'class': 'animals-invert__item'}):
            name = animal.find('h2').text
            img_url = animal['href']
            f.write(f'{name}: {img_url}\n')
    driver.quit()


def get_mammals_info():
    def add_to_dict(d, l1, l2):
        for key, value in zip(l1,l2):
            if key in d:
                d[key] = value
            else:
                with open('missing_attr.txt', 'a') as f:
                    f.write(f'{key}\n')

    start = time.time()
    print('Start crawling data...')

    with open('mammals.txt', 'r', encoding='utf-8') as f:
        mammals = f.readlines()
    default_dict = {'common_name': '', 'img_url': '', 'description': '', 'kingdom' : '', 'phylum': '', 'subphylum': '', 'class': '', 'infraclass': '', 'order': '', 'suborder': '', 'infraorder': '', 'superorder': '', 'family': '', 'subfamily': '', 'superfamily': '', 'genus': '', 'subgenus': '', 'species': '', 'subspecies of': ''} # there are missing attributes like tribe, clade, etc... You can add them if wanted

    client = MongoClient(CONNECTION_STRING)
    database = client["Cluster0"]
    collection = database["mammals"]
        
    driver = get_driver()

    for i, mammal in enumerate(tqdm(mammals)):
        if i < 6117:
            continue
        name, img_url = mammal.strip().split(': ')
        img_url = img_url if img_url.startswith('https://') else 'https://www.animalia.bio' + img_url

        try:
            driver.get(img_url)
            WebDriverWait(driver, 4).until(EC.presence_of_element_located((By.CLASS_NAME, 's-char-text')))
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
        except:
            with open('error_mammals.txt', 'a') as f:
                f.write(f'{name} {img_url}\n')
            continue

        available_attrs =  [c.text.lower().strip() for c in soup.find_all('div', {'class': 's-char-kinds__attr'})]
        classification = [c.text for c in soup.find_all('a', {'class': 's-char-kinds__name'})]
        classification.append(soup.find('div', {'class': 's-char-kinds__name'}).text.strip())
        img_url = soup.find('div', {'class': 's-char-img'})
        img_url = img_url.find('img')['src'] if img_url is not None else ''
        desc = soup.find('div', {'class': 's-char-text'}).text

        mammal_dict = default_dict.copy()
        add_to_dict(mammal_dict, ['common_name', 'img_url', 'description'], [name, img_url, desc])
        add_to_dict(mammal_dict, available_attrs, classification)
        collection.insert_one(mammal_dict)

        if i != 0 and i % 50 == 0: # get new driver to replicate different users
            driver.quit()
            driver = get_driver()
    driver.quit()
    client.close()
    print('Finish crawling data. Time taken:', time.time() - start)


def remove_duplicates():
    start = time.time()
    client = MongoClient(CONNECTION_STRING)
    database = client["Cluster0"]
    collection = database["mammals"]

    pipeline = [
        {"$group": {
            "_id": {"common_name": "$common_name"},
            "uniqueIds": {"$addToSet": "$_id"},
            "count": {"$sum": 1}
        }},
        {"$match": {
            "count": {"$gt": 1}
        }}
    ]

    duplicates = list(collection.aggregate(pipeline))

    for duplicate in duplicates:
        unique_ids = duplicate['uniqueIds']
        for unique_id in unique_ids[1:]:
            collection.delete_one({"_id": unique_id})

    print("Duplicates removed successfully.")
    print(time.time() - start)

# Uncomment the function you want to run
# get_mammals_list()
# get_mammals_info()
# remove_duplicates()