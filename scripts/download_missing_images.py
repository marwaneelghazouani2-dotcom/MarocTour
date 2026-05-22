import os
import re
import urllib.request
import urllib.parse
import json
import time
from bs4 import BeautifulSoup

work_dir = "/home/boua/Desktop/S2/WEB/MarocTour"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
}

def search_wikipedia_image(query):
    # Introduce sleep to prevent 429 Too Many Requests
    time.sleep(1.2)
    try:
        search_url = 'https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + urllib.parse.quote(query) + '&limit=1'
        req = urllib.request.Request(search_url, headers=headers)
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        
        if len(res) > 1 and len(res[1]) > 0:
            page_title = res[1][0]
            print(f"  Found Wikipedia page: '{page_title}' for query '{query}'")
            
            time.sleep(0.5)
            image_url = 'https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=' + urllib.parse.quote(page_title) + '&pithumbsize=1200'
            req2 = urllib.request.Request(image_url, headers=headers)
            res2 = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
            
            pages = res2.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'thumbnail' in pdata:
                    thumb_url = pdata['thumbnail']['source']
                    return thumb_url
    except Exception as e:
        print(f"  Error searching Wikipedia for '{query}': {e}")
    return None

def download_image(url, local_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as response:
            data = response.read()
            if len(data) > 1000:
                with open(local_path, 'wb') as f:
                    f.write(data)
                print(f"  Successfully downloaded: {local_path} ({len(data)} bytes) from {url}")
                return True
            else:
                print(f"  Downloaded data too small ({len(data)} bytes) for {url}")
    except Exception as e:
        print(f"  Error downloading from {url}: {e}")
    return False

# List of all HTML files to inspect
html_files = [f for f in os.listdir(work_dir) if f.endswith('.html')]

# We'll map missing image paths to queries
missing_images = {}

for html_file in html_files:
    filepath = os.path.join(work_dir, html_file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            # Skip remote URLs
            if src.startswith(('http://', 'https://')):
                continue
                
            img_path = os.path.join(work_dir, src)
            if not os.path.exists(img_path) or os.path.getsize(img_path) == 0:
                alt = img.get('alt', '').strip()
                card_title = ""
                parent_card = img.find_parent(class_='info-card')
                if parent_card:
                    title_el = parent_card.select_one('.card-title')
                    if title_el:
                        card_title = title_el.get_text().strip()
                
                query = alt or card_title or html_file.replace('.html', '').capitalize()
                query = re.sub(r'\(.*?\)', '', query)
                query = query.replace('Vue sur', '').replace('Vue de', '').replace('Photo de', '').strip()
                
                missing_images[src] = {
                    'query': query,
                    'file_path': img_path,
                    'type': 'img',
                    'city': html_file.replace('.html', '').capitalize()
                }

    bg_matches = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', content)
    for bg_src in bg_matches:
        # Skip remote URLs
        if bg_src.startswith(('http://', 'https://')):
            continue
            
        if bg_src.endswith(('.jpg', '.jpeg', '.png')):
            bg_path = os.path.join(work_dir, bg_src)
            if not os.path.exists(bg_path) or os.path.getsize(bg_path) == 0:
                city = html_file.replace('.html', '').capitalize()
                missing_images[bg_src] = {
                    'query': f"{city} Maroc",
                    'file_path': bg_path,
                    'type': 'bg',
                    'city': city
                }

print(f"Found {len(missing_images)} missing or empty images.")

for src, info in missing_images.items():
    print(f"\nProcessing missing image '{src}':")
    query = info['query']
    file_path = info['file_path']
    city = info['city']
    
    dir_name = os.path.dirname(file_path)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
        
    is_hotel = 'hotel' in query.lower() or 'hotel' in src.lower() or 'mirage' in query.lower() or 'palace' in query.lower() or 'riad' in query.lower()
    is_restaurant = 'restaurant' in query.lower() or 'cafe' in query.lower() or 'manger' in query.lower() or 'saveur' in query.lower() or 'nourriture' in query.lower() or 'plat' in query.lower()
    
    img_url = None
    
    # Try Wikipedia for primary landmarks (non-hotel/restaurant)
    if not is_hotel and not is_restaurant:
        img_url = search_wikipedia_image(query)
        if not img_url and city.lower() not in query.lower():
            img_url = search_wikipedia_image(f"{query} {city}")
            
    # Try LoremFlickr (Flickr Creative Commons) with specific query tags if Wikipedia failed or was skipped
    if not img_url:
        print("  Using LoremFlickr fallback...")
        clean_q = re.sub(r'[^a-zA-Z0-9]', '', query.replace(' ', ''))
        clean_city = re.sub(r'[^a-zA-Z0-9]', '', city)
        
        # Tags for search
        tags = f"morocco,{clean_city}"
        if is_hotel:
            tags = "morocco,riad,hotel"
        elif is_restaurant:
            tags = "morocco,food,tajine"
        elif "plage" in query.lower() or "beach" in query.lower() or "dune" in query.lower():
            tags = f"morocco,{clean_city},beach"
        
        img_url = f"https://loremflickr.com/1200/800/{tags}"
        
    print(f"  Downloading from: {img_url}")
    download_image(img_url, file_path)

print("All missing images checked!")
