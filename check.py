import os
import json

GAMES_DIR = './games'
DIRECTORIES_JSON = './storage/js/directories.json'
THUMBNAIL_DIR = '/images/thumbnails'

# 1. List all folders in /games
game_folders = [name for name in os.listdir(GAMES_DIR) if os.path.isdir(os.path.join(GAMES_DIR, name))]

# 2. Extract referenced folders from directories.json
with open(DIRECTORIES_JSON) as f:
    data = json.load(f)

referenced = set(key.split('/')[0] for key in data.keys())

# 3. Show unreferenced folders
unreferenced = sorted(set(game_folders) - referenced)
print("Unreferenced game folders:")
for folder in unreferenced:
    print(folder)

if not unreferenced:
    print("All folders are referenced.")
    exit(0)

# 4. Prompt for folder name
folder_name = input("\nEnter the folder name to add: ").strip()
if folder_name not in unreferenced:
    print("Folder not found or already referenced.")
    exit(1)

# 5. List all files in the folder (recursively)
files_list = []
for root, dirs, files in os.walk(os.path.join(GAMES_DIR, folder_name)):
    for file in files:
        rel_path = os.path.relpath(os.path.join(root, file), '.')
        files_list.append('/' + rel_path.replace('\\', '/'))

# 6. Build new entry
entry_key = f"{folder_name}/index.html"
thumbnail_path = f"{THUMBNAIL_DIR}/{folder_name}.jpg"
new_entry = {
    "files": files_list,
    "thumbnail": thumbnail_path
}

# 7. Add to directories.json and save
data[entry_key] = new_entry
with open(DIRECTORIES_JSON, 'w') as f:
    json.dump(data, f, indent=4)

print(f"\nAdded entry for {folder_name}:")
print(json.dumps({entry_key: new_entry}, indent=4))

