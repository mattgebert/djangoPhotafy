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


class ImageFieldForm(forms.ModelForm):
    new_set = forms.BooleanField()
    new_set_name = forms.CharField()
    img = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

    class Meta:
        model = Image
        fields = ["image_set"]
