from PIL import Image
import os

def crop_transparent(image_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        
        # Get the bounding box of the non-transparent alpha channel
        bbox = img.getbbox()
        if bbox:
            cropped_img = img.crop(bbox)
            cropped_img.save(image_path, "PNG")
            print(f"Cropped {image_path}")
        else:
            print(f"Empty image or no alpha variation {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

assets = [
    "apps/web/public/assets/3d_glass_lock.png",
    "apps/web/public/assets/3d_glass_shield.png",
    "apps/web/public/assets/3d_glass_eye.png",
    "apps/web/public/assets/3d_glass_bundle.png"
]

for asset in assets:
    crop_transparent(asset)

