from django import forms
from .models import ConsultationRequest

class ConsultationForm(forms.ModelForm):
    class Meta:
        model = ConsultationRequest
        fields = ['full_name', 'mobile_number', 'district', 'pin_code', 'message']

    def clean_mobile_number(self):
        mobile_number = self.cleaned_data.get('mobile_number')
        if not mobile_number or len(mobile_number) != 10 or not mobile_number.isdigit():
            raise forms.ValidationError("Valid 10-digit mobile number is required")
        return mobile_number

    def clean_pin_code(self):
        pin_code = self.cleaned_data.get('pin_code')
        if not pin_code or len(pin_code) != 6 or not pin_code.isdigit():
            raise forms.ValidationError("Valid 6-digit PIN code is required")
        return pin_code
