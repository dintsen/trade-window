from PIL import Image
import os
import sys

def remove_black_bg(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # If the pixel is very dark (close to black), make it transparent
            # We use a threshold, e.g., if R<20, G<20, B<20
            if item[0] < 25 and item[1] < 25 and item[2] < 25:
                # Calculate alpha based on how dark it is to make smooth edges
                # if it's 0,0,0 alpha is 0. if it's 20,20,20 alpha is roughly 50
                avg = (item[0] + item[1] + item[2]) / 3
                alpha = int((avg / 25.0) * 255)
                newData.append((item[0], item[1], item[2], alpha))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    assets = [
        "apps/web/public/assets/3d_glass_lock.png",
        "apps/web/public/assets/3d_glass_shield.png",
        "apps/web/public/assets/3d_glass_eye.png",
        "apps/web/public/assets/3d_glass_bundle.png",
        "apps/web/public/assets/nft_block_image.png"
    ]
    for asset in assets:
        remove_black_bg(asset, asset)

