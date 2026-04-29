@if($user->company_logo_url)
<div style="text-align: center; margin-bottom: 15px;">
<img src="{{ $user->company_logo_url }}" alt="{{ $user->company_name }}" style="max-height: 50px;">
</div>
@endif

<div style="text-align: center; font-size: 12px; color: #718096; line-height: 1.5;">
<strong>{{ $user->company_name ?? $user->name }}</strong><br>
@if($user->company_address)
{!! nl2br(e($user->company_address)) !!}<br>
@endif
{{ $user->company_email ?? $user->email }}<br>
@if($user->company_phone)
Phone: {{ $user->company_phone }}<br>
@endif
@if($user->company_vat_number)
VAT: {{ $user->company_vat_number }}
@endif
</div>
