<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Class CreateIncomeItemTable
 * Calls the migration to create the income item table
 */
class CreateIncomeItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('income_items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('income');
            $table->integer('account_id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('income_items');
    }
}
