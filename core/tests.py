from django.test import TestCase, Client
from django.urls import reverse
from .models import GeneralFAQ, ConsultationRequest
from .forms import ConsultationForm
import json

class ModelTests(TestCase):
    def test_general_faq_creation(self):
        faq = GeneralFAQ.objects.create(question="Test Q?", answer="Test A")
        self.assertEqual(str(faq), "Test Q?")
        self.assertTrue(faq.is_active)

    def test_consultation_request_creation(self):
        req = ConsultationRequest.objects.create(
            full_name="John Doe",
            mobile_number="1234567890",
            district="Kolkata",
            pin_code="700001",
            message="Hello"
        )
        self.assertEqual(str(req), "John Doe - 1234567890")

class FormTests(TestCase):
    def test_valid_consultation_form(self):
        data = {
            'full_name': 'Jane Doe',
            'mobile_number': '9876543210',
            'district': 'Howrah',
            'pin_code': '711101',
            'message': 'Interested'
        }
        form = ConsultationForm(data=data)
        self.assertTrue(form.is_valid())

    def test_invalid_mobile_number(self):
        data = {
            'full_name': 'Jane Doe',
            'mobile_number': '123', # Too short
            'district': 'Howrah',
            'pin_code': '711101'
        }
        form = ConsultationForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('mobile_number', form.errors)

    def test_invalid_pin_code(self):
        data = {
            'full_name': 'Jane Doe',
            'mobile_number': '9876543210',
            'district': 'Howrah',
            'pin_code': 'ABCDEF' # Not digits
        }
        form = ConsultationForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('pin_code', form.errors)

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.home_url = reverse('core:home')
        self.submit_url = reverse('core:submit_consultation')
        
        # Create some FAQs for the home page test
        GeneralFAQ.objects.create(question="Q1?", answer="A1")

    def test_home_view(self):
        response = self.client.get(self.home_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'index.html')
        # Check context
        self.assertIn('general_faqs', response.context)
        self.assertEqual(len(response.context['general_faqs']), 1)

    def test_submit_consultation_success(self):
        data = {
            'full_name': 'Test User',
            'mobile_number': '9090909090',
            'district': 'Test District',
            'pin_code': '100001',
            'message': 'Test Message'
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ConsultationRequest.objects.count(), 1)
        
        json_response = json.loads(response.content)
        self.assertTrue(json_response['success'])

    def test_submit_consultation_invalid(self):
        data = {
            'full_name': '', # Empty name
            'mobile_number': '000',
        }
        response = self.client.post(self.submit_url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ConsultationRequest.objects.count(), 0)
        
        json_response = json.loads(response.content)
        self.assertFalse(json_response['success'])
        self.assertIn('full_name', json_response['errors'])

class FrontendIntegrationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.home_url = reverse('core:home')
        # Create dummy data for sections that loop over models
        GeneralFAQ.objects.create(question="Test?", answer="Answer")

    def test_css_and_js_links(self):
        """Verify that the main frontend assets are linked in the response."""
        response = self.client.get(self.home_url)
        content = response.content.decode('utf-8')
        
        # Check for CSS link
        self.assertIn('static/css/styles.css', content)
        # Check for JS link
        self.assertIn('static/js/scripts.js', content)

    def test_animation_classes_presence(self):
        """Verify that key animation classes documented in FEATURES_AND_ANIMATIONS.md are present in the HTML."""
        response = self.client.get(self.home_url)
        content = response.content.decode('utf-8')
        
        # List of classes from FEATURES_AND_ANIMATIONS.md
        expected_classes = [
            'animate-on-scroll',
            'fade-up',
            'stagger-1',
            'count-up',      # Stats section
            'hero-slide',    # Hero section
            'faq-item',      # FAQ section
            'sync-card',     # Process section
        ]
        
        for cls in expected_classes:
            with self.subTest(cls=cls):
                self.assertIn(cls, content, f"Expected class '{cls}' not found in home page HTML.")

    def test_section_ids_presence(self):
        """Verify that the sections documented are actually present with correct IDs."""
        response = self.client.get(self.home_url)
        content = response.content.decode('utf-8')
        
        expected_ids = [
            'page-loader',
            'home',          # Hero section uses 'home' ID
            'calculator',
            'process',
            'stats',
            'faqs',
            'contact',
            'bill-slider',   # Calculator input
            'area-slider',   # Calculator input
            'faq-grid',      # FAQ container
            'consultation-form' # Contact form
        ]
        
        for element_id in expected_ids:
            with self.subTest(element_id=element_id):
                self.assertIn(f'id="{element_id}"', content, f"Expected ID '{element_id}' not found in home page HTML.")

    def test_js_file_functions(self):
        """Static analysis to verify that documented JS functions exist in scripts.js"""
        # Read the scripts.js file directly
        try:
            with open('static/js/scripts.js', 'r', encoding='utf-8') as f:
                js_content = f.read()
                
            expected_functions = [
                'initScrollAnimations',
                'calculateSolar',
                'filterFaq',
                'toggleFaq',
                'highlightActiveSection',
                'initHeroCarousel'
            ]
            
            for func in expected_functions:
                with self.subTest(func=func):
                    self.assertIn(f'function {func}', js_content, f"Documented function '{func}' not found in scripts.js")
                    
        except FileNotFoundError:
            self.fail("static/js/scripts.js file not found")

    def test_css_file_classes(self):
        """Static analysis to verify that documented CSS classes exist in styles.css"""
        try:
            with open('static/css/styles.css', 'r', encoding='utf-8') as f:
                css_content = f.read()
                
            expected_selectors = [
                '.animate-on-scroll',
                '.fade-up',
                '.zoom-in',
                '.hero-slide',
                '.faq-answer',
                '#page-loader'
            ]
            
            for selector in expected_selectors:
                with self.subTest(selector=selector):
                    self.assertIn(selector, css_content, f"Documented selector '{selector}' not found in styles.css")

        except FileNotFoundError:
            self.fail("static/css/styles.css file not found")

    def test_sliding_navbar_structure(self):
        """Verify that the sliding mobile navbar elements and logic are present."""
        response = self.client.get(self.home_url)
        content = response.content.decode('utf-8')

        # 1. Check for the mobile menu container (Drawer)
        self.assertIn('id="mobile-menu"', content, "Mobile menu drawer ID not found.")
        
        # 2. Check for the 'translate-x-full' class which hides it initially (providing the 'sliding' from right effect)
        # We look for the specific combination of id and class to ensure it's the right element's state
        self.assertIn('translate-x-full', content, "Mobile menu should have 'translate-x-full' class for sliding effect.")

        # 3. Check for the Backdrop
        self.assertIn('id="mobile-menu-backdrop"', content, "Mobile menu backdrop ID not found.")

        # 4. Check for the Toggle Button (Hamburger)
        # It should have the onclick attribute to trigger the function
        self.assertIn('onclick="toggleMobileMenu(true)"', content, "Hamburger button with correct onclick handler not found.")

        # 5. Check for the Close Button inside the menu
        self.assertIn('onclick="toggleMobileMenu(false)"', content, "Close button with correct onclick handler not found.")

        # 6. Verify the JS function exists in scripts.js (Static Analysis)
        try:
            with open('static/js/scripts.js', 'r', encoding='utf-8') as f:
                js_content = f.read()
            self.assertIn('function toggleMobileMenu', js_content, "toggleMobileMenu function not found in scripts.js")
        except FileNotFoundError:
            self.fail("static/js/scripts.js file not found")
