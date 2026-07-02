from PIL import Image

def super_crop(input_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        # Remove very dark background (<40 brightness) and force alpha=0
        newData = []
        for item in datas:
            if item[0] < 40 and item[1] < 40 and item[2] < 40 and item[3] > 0:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(input_path, "PNG")
        print(f"Super cropped {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

super_crop("apps/web/public/assets/nft_block_image.png")
