from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.http import JsonResponse
import pytesseract
from PIL import Image
from .models import Data
import json

class Index(TemplateView):
    template_name = 'ocr/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

def get_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        text = extract_text_from_image(image)
        data = text['text']
        return JsonResponse({'text': data})
    return JsonResponse({'error': '読み込み失敗'}, status=400)

def save_text(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        ocr_result = Data.objects.create(text=data['text'])
        return JsonResponse({'message': '保存成功'}, status=200)
    return JsonResponse({'error': '保存失敗'}, status=400)

def extract_text_from_image(image):
    text = pytesseract.image_to_string(Image.open(image), lang='jpn')
    return {'text':text}
