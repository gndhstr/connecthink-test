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
        Schema::disableForeignKeyConstraints();

        Schema::create('table_students', function (Blueprint $table) {
            $table->id();
            $table->string('nis_student');
            $table->string('name');
            $table->unsignedInteger('id_class');
            $table->foreign('id_class')->references('id_class')->on('table_class')->onDelete('set null');
            $table->dateTime('created_at');
            $table->dateTime('edited_at');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_students');
    }
};
