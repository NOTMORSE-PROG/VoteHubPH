<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('reporter_id');
            $table->string('reportable_type'); // 'post' | 'comment'
            $table->unsignedBigInteger('reportable_id');
            $table->string('reason'); // Misinformation|Offensive|Spam|Impersonation|Other
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // 'pending'|'reviewed'|'dismissed'
            $table->timestamps();

            $table->index(['reportable_type', 'reportable_id']);
            $table->index('reporter_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
