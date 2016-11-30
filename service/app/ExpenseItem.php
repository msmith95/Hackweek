<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ExpenseItem extends Model
{
    protected $fillable = ['category', 'budgeted', 'spent', 'remaining'];
}
