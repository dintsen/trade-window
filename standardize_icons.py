from PIL import Image

def standardize_icon(input_path):
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
        
        # 1. Crop exactly
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        
        # 2. Scale so longest edge is 400px
        max_size = 400
        w, h = img.size
        if w > h:
            new_w = max_size
            new_h = int((float(max_size)/w) * h)
        else:
            new_h = max_size
            new_w = int((float(max_size)/h) * w)
            
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # 3. Paste into center of 500x500 transparent canvas
        canvas_size = 500
        canvas = Image.new("RGBA", (canvas_size, canvas_size), (0,0,0,0))
        
        offset_x = (canvas_size - new_w) // 2
        offset_y = (canvas_size - new_h) // 2
        
        canvas.paste(img, (offset_x, offset_y), img)
        
        canvas.save(input_path, "PNG")
        print(f"Standardized {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

standardize_icon("apps/web/public/assets/3d_glass_lock.png")
standardize_icon("apps/web/public/assets/3d_glass_shield.png")
standardize_icon("apps/web/public/assets/3d_glass_trace.png")
standardize_icon("apps/web/public/assets/3d_glass_bundle.png")
