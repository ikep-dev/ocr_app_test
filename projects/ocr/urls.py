from django.urls import path, re_path
from .import views 

app_name = 'ocr'

urlpatterns = [
    path('index', views.Index.as_view(), name='index'),
    path('upload/', views.get_image, name='upload_image'),
    path('save/', views.save_text, name='save'),
]