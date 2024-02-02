from django import forms
from amy.models import ImageSet, Image
from django.core.exceptions import ValidationError

# class FileFieldForm(forms.Form):
    # file_field = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

# class CustomField(forms.Field):
#     def to_python(self,value):
#         "Normalise data to ___python-object___"
#         return value
#
#     def validate(self, value):
#         super().validate(value)
#         #Perform some check that value is legit.
#         return


class ImageSetFieldForm(forms.ModelForm):
    class Meta:
        model = ImageSet
        fields = ["set_name"]

    # def clean():
    # "Can use this method to clean multi-dependent attributes."
    #     cleaned_data = super().clean()

    def clean_set_name(self):
        data = self.cleaned_data["set_name"]
        setnames = [set.set_name for set in ImageSet.objects.all()]
        if data in setnames:
            raise ValidationError("Set name already used: " + data)
        return data

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class ImageFieldForm(forms.ModelForm):
    new_set = forms.BooleanField(required=False)
    new_set_name = forms.CharField(required=False)
    
    #Updated in Django 5.0  https://docs.djangoproject.com/en/5.0/topics/http/file-uploads/#uploading-multiple-files
    # img = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)
    img = forms.ImageField(widget=MultipleFileInput, required=False) 


    class Meta:
        model = Image
        fields = ["image_set"]

    def __init__(self, *args, **kwargs):
        super(ImageFieldForm,self).__init__(*args,**kwargs)
        self.fields['image_set'].required = False

    # def post(self, request, *args, **kwargs):
        # form_class = self.get_form_class()
    #     form = self.get_form(form_class)
    #     files = request.FILES.getlist('img')
    #     if form.is_valid():
    #         # for
    #         return self.form_valid()
    #     else:
    #         return self.form_invalid()

    # def clean_img(self):
    # def post(self, request, *args, **kwargs):
    #     print("okay")
    #     valid_formats = (".jpg",".png","jpeg","gif")
    #     images = request.FILES.get("img")
    #     for i in images:
    #         print(i)
    #         if not i.endswith(valid_formats):
    #             raise ValidationError("Allowed image formats are '.jpg', '.png', '.gif'.")
    #     return self.form_valid()

    def clean_new_set_name(self):
        if self.cleaned_data["new_set"]:
            data = self.cleaned_data["new_set_name"]
            setnames = [set.set_name for set in ImageSet.objects.all()]
            if data in setnames:
                raise ValidationError("Set name already used: " + data)
            return data
        else:
            return self.cleaned_data
