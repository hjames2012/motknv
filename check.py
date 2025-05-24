import os
import json

GAMES_DIR = './games'
DIRECTORIES_JSON = './storage/js/directories.json'
THUMBNAIL_DIR = '/images/thumbnails'

def get_unreferenced_folders():
    game_folders = [name for name in os.listdir(GAMES_DIR) if os.path.isdir(os.path.join(GAMES_DIR, name))]
    with open(DIRECTORIES_JSON) as f:
        data = json.load(f)
    referenced = set(key.split('/')[0] for key in data.keys())
    return sorted(set(game_folders) - referenced), data

def build_entry(folder_name):
    files_list = []
    for root, dirs, files in os.walk(os.path.join(GAMES_DIR, folder_name)):
        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), '.')
            files_list.append('/' + rel_path.replace('\\', '/'))
    entry_key = f"{folder_name}/index.html"
    thumbnail_path = f"{THUMBNAIL_DIR}/{folder_name}.jpg"
    new_entry = {
        "files": files_list,
        "thumbnail": thumbnail_path
    }
    return entry_key, new_entry

while True:
    unreferenced, data = get_unreferenced_folders()
    print("\nUnreferenced game folders:")
    for folder in unreferenced:
        print(folder)
    if not unreferenced:
        print("All folders are referenced.")
        break

    folder_name = input("\nEnter the folder name to add (or type 'all' to add all): ").strip()
    if folder_name.lower() == 'all':
        for folder in unreferenced:
            entry_key, new_entry = build_entry(folder)
            data[entry_key] = new_entry
            print(f"Added entry for {folder}:")
            print(json.dumps({entry_key: new_entry}, indent=4))
        with open(DIRECTORIES_JSON, 'w') as f:
            json.dump(data, f, indent=4)
        print("\nAll unreferenced folders have been added.")
        break
    elif folder_name in unreferenced:
        entry_key, new_entry = build_entry(folder_name)
        data[entry_key] = new_entry
        with open(DIRECTORIES_JSON, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"\nAdded entry for {folder_name}:")
        print(json.dumps({entry_key: new_entry}, indent=4))
        # Loop again to allow more additions
    else:
        print("Folder not found or already referenced. Please try again.")