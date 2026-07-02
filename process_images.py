from PIL import Image, ImageEnhance, ImageFilter
import os

def crop_and_enhance(image_path, enhance=False):
    try:
        img = Image.open(image_path).convert("RGBA")
        
        # Crop transparent padding
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        if enhance:
            # Upscale 1.5x and sharpen
            w, h = img.size
            img = img.resize((int(w * 1.5), int(h * 1.5)), Image.Resampling.LANCZOS)
            enhancer = ImageEnhance.Sharpness(img)
            img = enhancer.enhance(1.5)
            
        img.save(image_path, "PNG")
        print(f"Processed {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

assets_to_crop = [
    "apps/web/public/assets/3d_glass_trace.png",
    "apps/web/public/assets/nft_block_image.png"
]

for asset in assets_to_crop:
    crop_and_enhance(asset, enhance=False)

# 4th icon: bundle - enhance and scale up
crop_and_enhance("apps/web/public/assets/3d_glass_bundle.png", enhance=True)

