from django.contrib import admin
from .models import CarMake, CarModel


class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'country_of_origin')
    search_fields = ('name', 'country_of_origin')


class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('type', 'year')
    search_fields = ('name', 'car_make__name')


admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
