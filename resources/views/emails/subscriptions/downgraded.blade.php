<x-mail::message>
# Plan Change Scheduled

Hello {{ $user->name }},

This email confirms that you have requested a change to the **{{ $plan->name }}** plan.

To ensure you get the full value of your current subscription, your active features will remain available until the end of your current billing cycle.

<x-mail::panel>
**Current Plan:** Active until {{ \Carbon\Carbon::parse($effectiveDate)->format('M d, Y') }}  
**Scheduled Plan:** {{ $plan->name }}  
**Transition Date:** {{ \Carbon\Carbon::parse($effectiveDate)->addDay()->format('M d, Y') }}
</x-mail::panel>

Your account will automatically transition to the new plan on the date shown above. No further action is required from your side.

<x-mail::button :url="config('app.url') . '/dashboard'">
Go to Dashboard
</x-mail::button>

Best regards,  
{{ config('app.name') }}
</x-mail::message>
