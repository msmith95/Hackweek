<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $with = ['expenseItems', 'incomeItems'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function expenseItems(){
        return $this->hasMany('App\ExpenseItem');
    }

    public function incomeItems(){
        return $this->hasMany('App\IncomeItem');
    }

    /**
     * Find the requested account by searching through the user's accounts
     * @param $user - User who's accounts are being search through
     * @param $id - ID of the account to find
     * @return mixed
     */
    static public function findAccountById($user, $id){
        $account = $user->accounts->first(function ($value, $key) use ($id) {
            return $value->id == $id;
        });
        return $account;
    }
}
