<?php

namespace App\Http\Controllers;

use App\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    /**
     * Creates the new account for the user
     * @param Request $request
     * @return Account
     */
    public function create(Request $request){
        $account = new Account;
        $account->name = $request->input('name');
        $account->balance = $request->input('balance');

        $user = $request->user();

        $user->accounts()->save($account);

        return $account;
    }

    /**
     * Deletes the account from the user
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function deleteAccount(Request $request){
        $id = $request->input('accountID');
        $user = $request->user();

        $account = Account::findAccountById($user, $id);

        if($account === null){
            return response('', 404);
        }

        $account->delete();

        return response('', 200);
    }
}
