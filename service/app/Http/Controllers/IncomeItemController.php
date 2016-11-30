<?php

namespace App\Http\Controllers;

use App\Account;
use App\IncomeItem;
use Illuminate\Http\Request;

class IncomeItemController extends Controller
{
    public function createItem(Request $request){
        $user = $request->user();
        $incomeItem = json_decode($request->input('incomeItem'), true);

        $incomeItem = new IncomeItem($incomeItem);

        $user->incomeItems()->save($incomeItem);

        return $incomeItem;
    }

    public function deleteItem(Request $request){
        $incomeID = $request->input('incomeID');
        $accountID = $request->input('accountID');
        $user = $request->user();

        $account = Account::findAccountById($user, $accountID);

        $incomeItem = $this->findIncomeItemById($account, $incomeID);
        if($incomeItem === null){
            return response('', 404);
        }
        $incomeItem->delete();
        return response('', 200);
    }

    /**
     * @param $account
     * @param $incomeID
     */
    private function findIncomeItemById($account, $incomeID):void
    {
        $incomeItem = $account->incomeItems->first(function ($value, $key) use ($incomeID) {
            return $value->id == $incomeID;
        });
        return $incomeItem;
    }
}
