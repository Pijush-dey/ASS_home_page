from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
import json


from .models import GeneralFAQ, SubsidyFAQ, TechnicalFAQ, InstallationFAQ
from .forms import ConsultationForm

def home(request):
    """Render the main landing page with dynamic data."""
    context = {
        'general_faqs': GeneralFAQ.objects.filter(is_active=True).values('question', 'answer'),
        'subsidy_faqs': SubsidyFAQ.objects.filter(is_active=True).values('question', 'answer'),
        'technical_faqs': TechnicalFAQ.objects.filter(is_active=True).values('question', 'answer'),
        'installation_faqs': InstallationFAQ.objects.filter(is_active=True).values('question', 'answer'),
    }
    return render(request, 'index.html', context)


@require_POST
@csrf_protect
def submit_consultation(request):
    """Handle form submission via AJAX."""
    try:
        # Use the form for validation and saving
        form = ConsultationForm(request.POST)

        if not form.is_valid():
            # Convert form errors to the format expected by the frontend
            errors = {field: error[0] for field, error in form.errors.items()}
            return JsonResponse({'success': False, 'errors': errors}, status=400)
        
        form.save()
        
        # Here you can add logic to:
        # 1. Send email notification
        # 2. Send SMS confirmation
        # 3. Integrate with CRM
        
        # For now, just return success
        return JsonResponse({
            'success': True,
            'message': 'Thank you! Our team will contact you shortly.'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'errors': {'general': 'An error occurred. Please try again.'}
        }, status=500)
