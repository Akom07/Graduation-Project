from super_image import EdsrModel, ImageLoader
from PIL import Image
from rembg import remove
import requests
import sys

mod = sys.argv[1]


if mod == 'rembg':
    input_path = 'C:/Users/Akom/Desktop/gp/public/bgres/inpg.jpg'
    output_path = 'C:/Users/Akom/Desktop/gp/public/bgres/out.jpg'

    input = Image.open(input_path)
    output = remove(input)
    output.save(output_path)





if mod == 'scale':
    url = 'C:/Users/Akom/Desktop/gp/public/bgres/inpg.jpg'
    image = Image.open(url)

    model = EdsrModel.from_pretrained('eugenesiow/edsr-base', scale=4)
    inputs = ImageLoader.load_image(image)
    preds = model(inputs)

ImageLoader.save_image(preds, 'C:/Users/Akom/Desktop/gp/public/bgres/scaled_2x.png')

