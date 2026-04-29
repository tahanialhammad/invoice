<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create features table
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('type', ['limit', 'boolean'])->default('boolean');
            $table->timestamps();
        });

        // 2. Create feature_plan pivot table
        Schema::create('feature_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->foreignId('feature_id')->constrained()->onDelete('cascade');
            $table->string('value'); // e.g., "5", "unlimited", "true"
            $table->timestamps();
        });

        // 3. Drop features column from plans table
        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn('plans', 'features')) {
                $table->dropColumn('features');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feature_plan');
        Schema::dropIfExists('features');
        
        Schema::table('plans', function (Blueprint $table) {
            $table->json('features')->nullable();
        });
    }
};
