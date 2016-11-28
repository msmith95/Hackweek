<?php

namespace App\Http\Controllers;

use App\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function create(Request $request){
        $account = new Account;
        $account->name = $request->input('name');
        $account->balance = $request->input('balance');

        $user = $request->user();

        $user->accounts()->save($account);

        return response('', 200);
    }

    public function deleteAccount(Request $request){
        $id = $request->input('accountID');
        $user = $request->user();

        $accounts = $user->accounts;
        $account = $accounts->first(function($value, $key) use ($id){

            return $value->id == $id;
        });

        $account->delete();

        return response('', 200);
    }
}
