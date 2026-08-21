<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('verification_document_type')->nullable()->after('flag_reason');
            $table->string('verification_document_url')->nullable()->after('verification_document_type');
            $table->text('verification_document_notes')->nullable()->after('verification_document_url');
            $table->timestamp('verification_requested_at')->nullable()->after('verification_document_notes');
            $table->string('verification_method')->nullable()->after('verification_requested_at');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'verification_document_type',
                'verification_document_url',
                'verification_document_notes',
                'verification_requested_at',
                'verification_method',
            ]);
        });
    }
};
