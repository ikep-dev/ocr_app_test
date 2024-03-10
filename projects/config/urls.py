from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('user.urls')),
    # path('', include('authentication.urls')),
    # path('', include('common.urls')),
    # path('', include('timeCard.urls')),
    path('', include('ocr.urls')),
]
