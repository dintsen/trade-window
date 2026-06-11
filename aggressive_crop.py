from PIL import Image

def aggressive_crop(input_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        # We will make anything with alpha < 100 transparent to force a tight crop
        newData = []
        for item in datas:
            if item[3] < 50: # If it's mostly transparent, make it fully transparent
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)

        temp_img = Image.new("RGBA", img.size)
        temp_img.putdata(newData)
        
        bbox = temp_img.getbbox()
        if bbox:
            final_img = img.crop(bbox)
            final_img.save(input_path, "PNG")
            print(f"Aggressively cropped {input_path}")
        else:
            print("No bounding box found.")
    except Exception as e:
        print(f"Error: {e}")

aggressive_crop("apps/web/public/assets/3d_glass_trace.png")
