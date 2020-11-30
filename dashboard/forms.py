from django import forms
from info.models import Information



class EditProfileForm(forms.ModelForm):
	
	class Meta:
		model = Information
		exclude = ('born_date', 'address', 'cv')
