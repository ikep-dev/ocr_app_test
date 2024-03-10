from django.db import models

class Data(models.Model):
    text = models.TextField('読取データ', max_length=255)
    updated_at = models.DateTimeField('更新日', auto_now=True)
    created_at = models.DateTimeField('作成日', auto_now_add=True)

    def __str__(self):
        return self.text[:50]
