<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/index', [
            'clients' => auth()->user()->clients()->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:255',
            'address' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        auth()->user()->clients()->create($validated);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function show(Client $client)
    {
        $this->authorizeOwner($client);
        return Inertia::render('Clients/show', [
            'client' => $client->load('invoices')
        ]);
    }

    public function edit(Client $client)
    {
        $this->authorizeOwner($client);
        return Inertia::render('Clients/edit', [
            'client' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $this->authorizeOwner($client);

        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:255',
            'address' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $this->authorizeOwner($client);
        $client->delete();

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }

    protected function authorizeOwner(Client $client)
    {
        if ($client->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
