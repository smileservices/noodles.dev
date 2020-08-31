from django.contrib import admin
import users.models as models

@admin.register(models.CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'community_score', 'total_cast_votes', 'cast_votes_sentiment')
