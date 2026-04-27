<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionUpgradedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $plan;
    public $proRatedAmount;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $plan, $proRatedAmount)
    {
        $this->user = $user;
        $this->plan = $plan;
        $this->proRatedAmount = $proRatedAmount;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your subscription has been upgraded to {$this->plan->name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.subscriptions.upgraded',
            with: [
                'user' => $this->user,
                'plan' => $this->plan,
                'amount' => $this->proRatedAmount,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
