<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionDowngradedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $newPlan;
    public $effectiveDate;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $newPlan, $effectiveDate)
    {
        $this->user = $user;
        $this->newPlan = $newPlan;
        $this->effectiveDate = $effectiveDate;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your plan change to {$this->newPlan->name} is scheduled",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.subscriptions.downgraded',
            with: [
                'user' => $this->user,
                'plan' => $this->newPlan,
                'effectiveDate' => $this->effectiveDate,
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
