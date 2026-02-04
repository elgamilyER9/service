<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the status column to include 'rejected' and 'cancelled'
        try {
            DB::statement("ALTER TABLE service_requests MODIFY COLUMN status ENUM('pending', 'accepted', 'completed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending'");
        } catch (\Exception $e) {
            // Fallback for non-MySQL or if syntax differs (though this project uses MySQL)
            Schema::table('service_requests', function (Blueprint $table) {
                $table->string('status')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original (Note: this might fail if data contains rejected/cancelled)
        try {
            DB::statement("ALTER TABLE service_requests MODIFY COLUMN status ENUM('pending', 'accepted', 'completed') NOT NULL DEFAULT 'pending'");
        } catch (\Exception $e) {
            // Ignoring down migration failure in development cleanup
        }
    }
};
