<x-mail::message>
# Subscription Upgraded!

Hello {{ $user->name }},

We're excited to confirm that your subscription has been successfully upgraded to the **{{ $plan->name }}** plan. You now have immediate access to all the features included in this plan.

<x-mail::panel>
**New Plan:** {{ $plan->name }}  
**Amount Charged:** ${{ number_format($amount, 2) }} (Pro-rated)  
**Status:** Active Immediately
</x-mail::panel>

Thank you for choosing to grow with us!

<x-mail::button :url="config('app.url') . '/dashboard'">
Go to Dashboard
</x-mail::button>

If you have any questions about your new plan features, feel free to reply to this email.

Best regards,  
{{ config('app.name') }}
</x-mail::message>
