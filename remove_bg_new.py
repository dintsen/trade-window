from PIL import Image
import os

def remove_black_bg(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            if item[0] < 25 and item[1] < 25 and item[2] < 25:
                avg = (item[0] + item[1] + item[2]) / 3
                alpha = int((avg / 25.0) * 255)
                newData.append((item[0], item[1], item[2], alpha))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

remove_black_bg("apps/web/public/assets/3d_glass_trace.png", "apps/web/public/assets/3d_glass_trace.png")
