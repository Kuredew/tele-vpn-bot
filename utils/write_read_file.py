import json

def writeJsonFile(destFile:str, jsonData) -> bool:
    try:
        with open(destFile, "w") as f:
            json.dump(jsonData, f, indent=4)
            return True
    except FileNotFoundError:
        print(f"Error writing to {destFile}, file Not Found")
        return False