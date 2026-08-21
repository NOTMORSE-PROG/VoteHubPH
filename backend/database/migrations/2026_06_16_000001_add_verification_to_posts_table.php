<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('verification_status')->default('unverified')->after('admin_notes');
            $table->timestamp('verified_at')->nullable()->after('verification_status');
            $table->boolean('is_flagged')->default(false)->after('verified_at');
            $table->string('flag_reason')->nullable()->after('is_flagged');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['verification_status', 'verified_at', 'is_flagged', 'flag_reason']);
        });
    }
};
